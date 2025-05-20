import { IUser } from "../../models/user";
import { IMappedUserDto } from "../../types/userTypes";

export const mappedUsers = (user: IUser):IMappedUserDto => {
    return {
        _id: user._id.toString(),
        profileImage: user.profileImage,
        userName: user.userName,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        isBlocked: user.isBlocked
    }
}