import inquirer from 'inquirer';
import gradient from 'gradient-string';
import fs from 'fs';
import child_process from 'child_process'
import chalk from 'chalk'

const main = async () => {
    const exec = child_process.exec

    var run = function (cmd) {
        var child = exec(cmd, function (error, stdout, stderr) {
            if (stderr !== null) {
                console.log('' + stderr);
            }
            if (stdout !== null) {
                console.log('' + stdout);
            }
            if (error !== null) {
                console.log('' + error);
            }
        });
    };

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
        await run(`cp -r ./template/base/* ${answers.appName}/`)
        await run(`cp -r ./template/base/.??* ${answers.appName}/`)

        let modules = '';
        let devPackages = '';
        let packages = '';
        let indexFile = '.vue';
        if (answers.modules.includes('tailwind')) {
            // tailwind was selected
            modules += '@nuxtjs/tailwindcss '
            devPackages += '@nuxtjs/tailwindcss '
            indexFile = '-tw' + indexFile

            run(`cp -r ./template/addons/tailwind/main.css ${answers.appName}/assets/css/`)
            run(`cp -r ./template/addons/tailwind/tailwind.config.js ${answers.appName}/`)
        }

        if (answers.modules.includes('trpc')) {
            modules += 'trpc-nuxt '
            packages += 'trpc-nuxt zod '
            indexFile = '-trpc' + indexFile

            run(`cp -r ./template/addons/trpc/server ${answers.appName}/server`)
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
            run(`cp -r ./template/addons/prisma/* ${answers.appName}/prisma`)
        }

        run(`cp -r ./template/page-stubs/index/with${indexFile} ${answers.appName}/pages/index.vue`)
        modules = modules.trimEnd()
        modules = modules.split(' ')

        let data;
        let newValue;
        if (modules.includes('@nuxtjs/tailwindcss')) {
            run(`cp -r ./template/page-stubs/components/Technology.vue ${answers.appName}/components/`)

            data = fs.readFileSync(`${answers.appName}/nuxt.config.ts`, 'utf-8');
            newValue = data.replace('// tailwind cssPath stub', `tailwindcss: {\n       cssPath: '~/assets/css/main.css',\n     },`)
            await fs.writeFileSync(`${answers.appName}/nuxt.config.ts`, newValue, 'utf-8')
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

        console.log(chalk.bold('Installing dependencies, this may take a while...'))
        await run(`cd ${answers.appName} && npm i --save-exact --silent ${packages} && npm i --save-dev --silent ${devPackages}`)
    });
}

main()