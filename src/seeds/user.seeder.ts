import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entity/user.entity';

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
