import SaveLoadService from "../services/SaveLoadService";

export default async function sendDeathStat(x: number, y: number)
{
    const uuid = SaveLoadService.getUuid();

    fetch(`https://gamedeathstat-1-d7535730.deta.app/${uuid}/cv/${x}/${y}`, {
        "method": "GET",
        "headers": {}
    })
    .catch(error => {});
}