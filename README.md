# 目錄
- [資料夾結構說明](#資料夾結構說明)
- [專案創建與初始化](#專案創建與初始化)
- [Migration](#Migration)
- [Seed](#Seed)
- [在WSL啟動服務](#在WSL啟動服務)

## 資料夾結構說明
```
EXPRESS_TYPEORM_SQLITE_TYPESCRIPT
├── src                  // TypeScript 代碼
│   ├── entity           // 存儲實體（數據庫模型）的位置
│   │   └── User.ts      // 示例 entity
│   ├── migration        // 存儲遷移的目錄
│   ├── data-source.ts   // ORM和數據庫連接配置
│   └── index.ts         // 程序執行主文件
├── .gitignore           // gitignore文件
├── dat-source.ts        // ORM和數據庫連接配置
├── package.json         // node module 依賴
├── README.md            // 簡單的 readme 文件
└── tsconfig.json        // TypeScript 編譯選項
```


## 專案創建與初始化
1. 安裝 Typeorm - object-relational mapper
    `npm install typeorm -g`
2. 初始化專案
    `typeorm init --name <project_name> --database <database_type>`
    ex：`typeorm init --name express_typeorm_sqlite_typescript --database sqlite`
3. 安裝 Express — Node.js framework 
    `npm install express`
4. 安裝 Dotenv =>For access to your environment variable
    `npm install dotenv` 


## Migration
* 情境1：將`User` table中的`firstName`欄位名稱改成`email`
    1. 建立migration檔案
        `typeorm migration:create ./<path-to-migrations-dir>/<table_name>Refactoring`
        ex：`typeorm migration:create ./src/migration/UserRefactoring`
        ![](https://hackmd.io/_uploads/H1T4toyo2.png)

        建立好的檔案內容：
        ```typescript=
        import { MigrationInterface, QueryRunner } from 'typeorm';

        export class UserRefactoring1690444591979 implements MigrationInterface {
          public async up(queryRunner: QueryRunner): Promise<void> {
          }

          public async down(queryRunner: QueryRunner): Promise<void> {
          }
        }
        ```
    2. 在新增的檔案中，新增要執行的SQL語法
        ```typescript=
        import { MigrationInterface, QueryRunner } from 'typeorm';

        export class UserRefactoring1690444591979 implements MigrationInterface {
          public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "firstName" TO "email"`);
          }

          public async down(queryRunner: QueryRunner): Promise<void> {
              // reverts things made in "up" method
            await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "email" TO "firstName"`); 
          }
        }
        ```
    3. 執行migration的data-source.ts
        `npm run typeorm migration:run -- -d .\src\data-source.ts`
        
        ![](https://hackmd.io/_uploads/ByuG_i1s3.png)

* 情境2：將`User` table中的`email`欄位名稱還原為`firstName`
    `npm run typeorm migration:revert -- -d .\src\data-source.ts`

    ![](https://hackmd.io/_uploads/B1b9Ys1jh.png)

## Seed
* 安裝套件 Typeorm Extension
    `npm install typeorm-extension --save`
* `src/data-source.ts` 新增`seeds`, `factories`欄位與資料
    ```typescript=
    import 'reflect-metadata';
    import { DataSource, DataSourceOptions } from 'typeorm';
    import { SeederOptions } from 'typeorm-extension';

    const options: DataSourceOptions & SeederOptions = {
      type: 'sqlite',
      database: './database/nodeDB',
      synchronize: true, // option for migrate
      logging: false,
      entities: ['dist/entity/*.js'],
      // migrations: ['dist/migration/*.js'],
      seeds: ['dist/seeds/*{.ts,.js}'],
      factories: ['dist/factories/*{.ts,.js}'],
      subscribers: [],
    };
    export const dataSource = new DataSource(options);
    ```
* 新增`src/factories/user.factory.ts`，來產生假資料
    ```typescript=
    import { setSeederFactory } from 'typeorm-extension';
    import { User } from '../entity/User';

    export default setSeederFactory(User, (faker) => {
      const user = new User();
      user.userName = faker.person.firstName();
      user.password = faker.number.octal({ min: 8, max: 63 });
      user.email = faker.internet.email();

      return user;
    });
    ```

* 新增`src/seeds/user.seeder.ts`，將假資料新增至table
    ```typescript=
    import { DataSource } from 'typeorm';
    import { Seeder, SeederFactoryManager } from 'typeorm-extension';
    import { User } from '../entity/User';

    export default class UserSeeder implements Seeder {
      public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const userRepository = dataSource.getRepository(User);
        await userRepository.insert([
          {
            userName: 'TestUser3',
            email: 'test3@cybertan.com.tw',
            password: 'Mis@12345',
          },
        ]);

        const userFactory = await factoryManager.get(User);
        await userFactory.saveMany(5);
      }
    }
    ```

* `src/index.ts`新增執行Seeder function
    ```typescript=
    // ...
    (async () => {
      dataSource
        .initialize()
        .then(async () => {
          console.log('Data Source has been initialized!');
          //  Create and set express app
          const app = express();

          //  middleware
          app.use(express.json());
          app.use(express.urlencoded({ extended: true }));

          app.use('/', routes);

          //  Start express server
          app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
        })
        .catch((error) => console.log(error));
      runSeeders(dataSource, {
        seeds: ['dist/seeds/*.js'],
        factories: ['dist/factories/*.js'],
      });
    })();
    ```
## 在WSL啟動服務
1. 建立Docker File
    ```docker=
    FROM cimg/node AS builder
    WORKDIR /app
    COPY . .
    RUN npm install \
    && npm run build


    FROM node AS typeorm_express
    WORKDIR /app
    COPY --from=builder ./app/dist ./dist
    COPY package.json .
    COPY package-lock.json .
    RUN npm install --production
    CMD [ "npm", "start" ]
    ```
2. 建立Docker image
    `docker build -t express .`
3. 啟動container
    `docker run -p 9000:9001 express`
    ![](https://hackmd.io/_uploads/rJ1VELUj2.png)
4. 進入頁面
    `http://localhost:9000`
    ![](https://hackmd.io/_uploads/SkPIEIIj2.png)

## Reference
- [TypeORM 快速开始](https://typeorm.bootcss.com/#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
- [Example using TypeORM with Express](https://orkhan.gitbook.io/typeorm/docs/example-with-express)
- [Typeorm Extension - Seed](https://github.com/tada5hi/typeorm-extension#seed)
- [How To Create A Production Image For A Node.js + TypeScript App Using Docker Multi-Stage Builds](https://www.andreadiotallevi.com/blog/how-to-create-a-production-image-for-a-node-typescript-app-using-docker-multi-stage-builds)
