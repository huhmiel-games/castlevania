import { isDev } from "../constant/config";

export function log(message: string)
{
    if (isDev)
    {
        console.log(message);
    }
}

export function warn(message: string)
{
    if (isDev)
    {
        console.warn(message);
    }
}

export function error(message: string)
{
    if (isDev)
    {
        console.error(message);
    }
}