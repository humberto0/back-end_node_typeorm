
import {getRepository} from "typeorm";
import User from "../models/User";
import path from "path";
import uploadConfig from "../config/upload"
import fs from 'fs'
import AppError from "../errors/AppError";


/*
* Recebimento das informações
* Tratativa de Erros/excessões
* Acesso ao repositorio
* */
interface Request{
    user_id: string;
    avatarFileName: string;
}

/*
* dependency inversion(SOLID)
* */

class UpdateUserAvatarService{

    public async execute({user_id, avatarFileName}:Request): Promise<User> {
        const usersRepository = getRepository(User)
        const user =await usersRepository.findOne(user_id);
        if(!user){
            throw new AppError('Only authenticated user can change user', 401)
        }
        if(user.avatar){
            const userAvatarFilePath= path.join(uploadConfig.directory, user.avatar)
            const userAvatarFileExists= await fs.promises.stat(userAvatarFilePath)
            if(userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }
        user.avatar =avatarFileName;
        await usersRepository.save(user);
        return user
    }
}
export default UpdateUserAvatarService

