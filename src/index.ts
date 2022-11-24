import si from "systeminformation";
import os from "node:os";

process.stdout.write(String.fromCharCode(27) + "]0;" + "OS MONITOR" + String.fromCharCode(7));
const run = async () => {    
    const to_GB = (num: number) => (num/1024/1024/1024).toFixed(2);
    const memory_infos = await si.mem();
    const disk_info = await si.disksIO();
    
    const status = {
        MACHINE: process.platform+": " + os.userInfo().username +"@"+ (await si.networkInterfaces()).find(e=> e.default)?.ip4,
        CPUS: (await si.cpuCurrentSpeed()).cores.map(e=> e + " GHz"),
        CPU_USAGE: ((await si.currentLoad()).currentLoad.toFixed(1) + " %"),
        CPU_TEMP: ((await si.cpuTemperature())?.main || 0) + "º C",
        MEMORY: `${to_GB(memory_infos.used)}/${to_GB(memory_infos.total)} GB`, 
        MEMORY_USAGE: `${((memory_infos.used * 100) / memory_infos.total).toFixed(1)} %`,    
        DISK: `W: ${(disk_info?.wWaitPercent || 0).toFixed(1) + " %"} - R: ${(disk_info?.rWaitPercent || 0).toFixed(1) + " %"}`,
        DISK_USAGE: (disk_info?.tWaitPercent || 0).toFixed(1) + " %"
    };

    console.clear();
    console.log(status);
};

run();
setInterval(async () => await run(), 3000);