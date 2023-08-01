import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entity/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.userName = faker.person.firstName();
  user.password = faker.internet.password({ length: 8 });
  user.email = faker.internet.email();

  return user;
});
