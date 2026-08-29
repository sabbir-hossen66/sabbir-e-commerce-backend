import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
