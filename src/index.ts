#!/usr/bin/env node

import inquirer from 'inquirer';
import gradient from 'gradient-string';
import fs from 'fs-extra';
import path from 'path';
import { exec } from "child_process";
import { promisify } from "util";
import chalk from 'chalk'
import { PKG_ROOT } from './consts'

const main = async () => {
    const execa = promisify(exec);

    const questions = [
        {
            type: 'input',
            name: 'appName',
            message: 'What will your project be called?',
            default() {
                return 'my-dev7-app';
            },
            validate(value) {
                const exists = fs.existsSync(value)

                if (!exists) {
                    return true;
                }

                return `Folder ${value} already exists.`
            }
        },
        {
            type: 'checkbox',
            name: 'modules',
            message: 'Create dev7 app',
            choices: [
                {
                    name: 'nuxtAuth',
                },
                {
                    name: 'prisma',
                },
                {
                    name: 'tailwind',
                },
                {
                    name: 'trpc',
                },
            ],
        }
    ]

    const prompt = inquirer.createPromptModule()

    console.log(gradient.pastel.multiline(`\n  
  _____                _             _          ______                        
 / ____|              | |           | |        |____  |     /\\                
| |     _ __ ___  __ _| |_ ___    __| | _____   __ / /     /  \\   _ __  _ __  
| |    | '__/ _ \\/ _\` | __/ _ \\  / _\` |/ _ \\ \\ / // /     / /\\ \\ | '_ \\| '_ \\ 
| |____| | |  __/ (_| | ||  __/ | (_| |  __/\\ V // /     / ____ \\| |_) | |_) |
 \\_____|_|  \\___|\\__,_|\\__\\___|  \\__,_|\\___| \\_//_/     /_/    \\_\\ .__/| .__/ 
                                                                 |_|   |_|    \n`))
    prompt(questions).then(async (answers) => {
        await fs.mkdirSync(answers.appName)
        const basedir = path.join(PKG_ROOT, 'template/base')

        await Promise.all([
            fs.copy(basedir, answers.appName),
        ])

        let modules: any = '';
        let devPackages: any = '';
        let packages: any = '';
        let indexFile: string = '.vue';
        if (answers.modules.includes('tailwind')) {
            // tailwind was selected
            modules += '@nuxtjs/tailwindcss '
            devPackages += '@nuxtjs/tailwindcss '
            indexFile = '-tw' + indexFile

            const tailwindcsssource = path.join(PKG_ROOT, 'template/addons/tailwind/main.css')
            const tailwindcssdest = path.join(answers.appName, 'assets/css/main.css')
            const tailwindconfigsource = path.join(PKG_ROOT, 'template/addons/tailwind/tailwind.config.js')
            const tailwindconfigdest = path.join(answers.appName, 'tailwind.config.js')
            const technologyqsource = path.join(PKG_ROOT, 'template/page-stubs/components/Technology.vue')
            const technologyqdest = path.join(answers.appName, 'components/Technology.vue')

            await Promise.all([
                fs.copy(tailwindcsssource, tailwindcssdest),
                fs.copy(tailwindconfigsource, tailwindconfigdest),
                fs.copy(technologyqsource, technologyqdest)
            ])
        }

        if (answers.modules.includes('trpc')) {
            modules += 'trpc-nuxt '
            packages += 'trpc-nuxt zod '
            indexFile = '-trpc' + indexFile

            const trpcserversource = path.join(PKG_ROOT, 'template/addons/trpc/server')
            const trpcserversdest = path.join(PKG_ROOT, `${answers.appName}/server`)

            await Promise.all([
                fs.copy(trpcserversource, trpcserversdest),
            ])
        }

        if (answers.modules.includes('nuxtAuth')) {
            packages += '@nuxtjs/auth-next @nuxtjs/axios '
            modules += '@nuxtjs/axios @nuxtjs/auth-next '
            indexFile = '-auth' + indexFile
        }

        if (answers.modules.includes('prisma')) {
            packages += '@prisma/client '
            devPackages += 'prisma '
            fs.mkdirSync(`${answers.appName}/prisma`)
            const prismasource = path.join(PKG_ROOT, 'template/addons/prisma/')
            const prismasdest = path.join(PKG_ROOT, `${answers.appName}/prisma`)

            await Promise.all([
                fs.copy(prismasource, prismasdest),
            ])
        }
        const indexsource = path.join(`${PKG_ROOT}`, `template/page-stubs/index/with${indexFile}`)
        const indexdest = path.join(`${answers.appName}`, `pages/index.vue`)

        await Promise.all([
            fs.copy(indexsource, indexdest)
        ])

        modules = modules.trimEnd()
        modules = modules.split(' ')
        packages = packages.trimEnd().split(' ')
        devPackages = devPackages.trimEnd().split(' ')

        let data;
        let newValue;
        if (modules.includes('@nuxtjs/tailwindcss')) {
            data = fs.readFileSync(`${answers.appName}/nuxt.config.ts`, 'utf-8');
            newValue = data.replace('// tailwind cssPath stub', `tailwindcss: {\n       cssPath: '~/assets/css/main.css',\n     },`)
            fs.writeFileSync(`${answers.appName}/nuxt.config.ts`, newValue, 'utf-8')
        }

        if (modules.includes('trpc-nuxt')) {
            data = fs.readFileSync(`${answers.appName}/nuxt.config.ts`, 'utf-8');
            newValue = data.replace('// trpc stub', `trpc: {\n        baseURL: 'http://localhost:3000', // defaults to http://localhost:3000\n        endpoint: '/trpc', // defaults to /trpc\n    },`)
            await fs.writeFileSync(`${answers.appName}/nuxt.config.ts`, newValue, 'utf-8')
        }

        let nuxtmods = "";
        modules.forEach(module => { nuxtmods += ("      '" + module + "',\n") })
        data = fs.readFileSync(`${answers.appName}/nuxt.config.ts`, 'utf-8');
        newValue = data.replace('// module stub', `modules: [\n${nuxtmods}    ],`)
        await fs.writeFileSync(`${answers.appName}/nuxt.config.ts`, newValue, 'utf-8')
        const jsonlocation = path.join(answers.appName, 'package.json')

        packages.forEach(async (module) => {
            const pkgJson = await fs.readJson(jsonlocation)
            const pkgName = module.replace(/^(@?[^@]+)(?:@.+)?$/, "$1");
            const { stdout: latestVersion } = await execa(`npm show ${module} version`);
            if (!latestVersion) {
                console.warn("WARN: Failed to resolve latest version of package:", module);
            }
            pkgJson.dependencies![pkgName] = `^${latestVersion}`;

            await fs.writeJSON(path.join(answers.appName, "package.json"), pkgJson, {
                spaces: 2,
            });
        })

        devPackages.forEach(async (module) => {
            const pkgJson = await fs.readJson(jsonlocation)
            const pkgName = module.replace(/^(@?[^@]+)(?:@.+)?$/, "$1");

            const { stdout: latestVersion } = await execa(`npm show ${module} version`);
            if (!latestVersion) {
                console.warn("WARN: Failed to resolve latest version of package:", module);
            }
            pkgJson.devDependencies![pkgName] = `^${latestVersion}`;

            await fs.writeJSON(path.join(answers.appName, "package.json"), pkgJson, {
                spaces: 2,
            });
        })

        console.log(chalk.bold(`Instalation complete!\nNext Steps:\n`), chalk.italic.bold(` cd ${answers.appName}\n  npm install\n  npm run dev`))
    });
}

main()