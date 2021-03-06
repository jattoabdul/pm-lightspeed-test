import factory from "factory-girl";
import UserModel from "../../model/user.model";
import { v1 as uuid } from 'uuid';
import faker from 'faker';

factory.define('User', UserModel, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password,
    role: 'customer',
    accessToken: uuid()
})
