
import type { Model } from "./base/basic";
import type LoginUser from "./LoginUser";

export default interface ExtUser extends LoginUser {
    age: number,
    gender: Model.Gender
    region: Model.Region
}