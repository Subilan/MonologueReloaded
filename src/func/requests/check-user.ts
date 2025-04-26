
import type LoginUser from "@/models/LoginUser";
import post from "../post";
import type { Feedback } from "@/types";
import { RequestApis, RET_NG, RET_OK } from "./consts";

export default async function checkUser(user: LoginUser): Feedback<null, string> {
    const res = await post(RequestApis.CHECK_USER, user);

    if (res.data.status !== 'ok') {
        return RET_NG(res.data.message);
    }

    return RET_OK;
}