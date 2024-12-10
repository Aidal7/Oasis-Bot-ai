export function createUniqueId(length = 26) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

function createCpuDetails() {
    const cpuModels = [
        "AMD Ryzen 5 5600G with Radeon Graphics",
        "Intel Core i7-9700K",
        "AMD Ryzen 7 5800X",
        "Intel Core i9-10900K",
        "Intel Core i5-11600K",
        "AMD Ryzen 9 5900X",
        "Intel Core i7-12700K",
        "AMD Ryzen 5 3600X",
        "Intel Core i9-11900K",
        "AMD Ryzen 3 3200G",
        "AMD Ryzen 9 5950X",
        "Intel Core i5-10400F",
        "AMD Ryzen 7 3700X",
        "Intel Core i3-10100",
        "AMD Ryzen 5 2600",
        "Intel Core i9-12900K",
        "AMD Ryzen Threadripper 3990X",
        "Intel Xeon E5-2670",
        "AMD EPYC 7742",
        "Intel Core i7-10700K",
        "AMD Ryzen Threadripper 3970X",
        "Intel Core i9-11980HK",
        "AMD EPYC 7763",
        "Intel Xeon Platinum 8280",
        "AMD Ryzen 9 7950X",
        "Intel Core i9-13900K",
        "AMD Ryzen Threadripper PRO 3995WX",
        "Intel Xeon W-3175X",
        "AMD Ryzen 9 7900X",
        "Intel Core i9-12950HX",
        "AMD EPYC 7713",
        "Intel Xeon Gold 6258R",
        "AMD Ryzen Threadripper 3995WX",
        "Intel Core i9-13980XE",
        "AMD EPYC 7643",
        "Intel Xeon Platinum 8358",
        "AMD Ryzen 7 7700X",
        "Intel Core i7-13700K",
        "AMD Ryzen 9 3950X",
        "Intel Core i9-10980XE",
        "AMD EPYC 7543",
        "Intel Xeon Gold 6230R",
        "AMD Ryzen Threadripper 3960X",
        "Intel Core i9-10940X",
        "AMD EPYC 7452",
        "Intel Xeon Platinum 8260",
        "AMD Ryzen 7 5800H",
        "Intel Core i7-11800H",
        "AMD Ryzen 9 6900HX",
        "Intel Core i9-11900H",
        "AMD EPYC 7313",
        "Intel Xeon Silver 4216",
        "AMD Ryzen 5 5600X",
        "Intel Core i5-12600K",
        "AMD Ryzen 7 5700G",
        "Intel Core i7-11700K",
        "AMD Ryzen 9 6900HS",
        "Intel Core i9-12900H"
    ];

    const features = ["mmx", "sse", "sse2", "sse3", "ssse3", "sse4_1", "sse4_2", "avx"];
    const numOfProcessors = [4, 8, 16, 32][Math.floor(Math.random() * 4)];

    let processors = [];
    for (let i = 0; i < numOfProcessors; i++) {
        processors.push({
            usage: {
                idle: Math.floor(Math.random() * 2000000000000),
                kernel: Math.floor(Math.random() * 10000000000),
                total: Math.floor(Math.random() * 2000000000000),
                user: Math.floor(Math.random() * 50000000000)
            }
        });
    }

    return {
        archName: "x86_64",
        features: features,
        modelName: cpuModels[Math.floor(Math.random() * cpuModels.length)],
        numOfProcessors: numOfProcessors,
        processors: processors,
        temperatures: []
    };
}

function createGpuDetails() {
    const renderers = [
        "AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 1080 Ti Direct3D11 vs_5_0 ps_5_0",
        "Intel Iris Xe Graphics (0x00008086) Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 6800 XT Direct3D11 vs_5_0 ps_5_0",
        "Intel UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 1660 Super Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 5700 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA Quadro RTX 4000 Direct3D11 vs_5_0 ps_5_0",
        "Intel HD Graphics 620 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 3090 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 6900 XT Direct3D11 vs_5_0 ps_5_0",
        "Intel Arc A770 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0",
        "Intel Iris Plus Graphics Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX Vega 56 Direct3D11 vs_5_0 ps_5_0",
        "Intel HD Graphics 530 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 6600 XT Direct3D11 vs_5_0 ps_5_0",
        "Intel UHD Graphics 750 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 3050 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 5500 XT Direct3D11 vs_5_0 ps_5_0",
        "Intel Iris Xe MAX Graphics Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 5600 XT Direct3D11 vs_5_0 ps_5_0",
        "Intel HD Graphics 500 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 2080 Ti Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 5700 XT Direct3D11 vs_5_0 ps_5_0",
        "Intel Iris Pro Graphics 580 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 1070 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 480 Direct3D11 vs_5_0 ps_5_0",
        "Intel UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 2070 Super Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 590 Direct3D11 vs_5_0 ps_5_0",
        "Intel HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 1080 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 470 Direct3D11 vs_5_0 ps_5_0",
        "Intel Iris Graphics 6100 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 1060 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 460 Direct3D11 vs_5_0 ps_5_0",
        "Intel UHD Graphics 605 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce RTX 2060 Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 550 Direct3D11 vs_5_0 ps_5_0",
        "Intel Iris Pro Graphics 5200 Direct3D11 vs_5_0 ps_5_0",
        "NVIDIA GeForce GTX 980 Ti Direct3D11 vs_5_0 ps_5_0",
        "AMD Radeon RX 580 Direct3D11 vs_5_0 ps_5_0",
        "Intel HD Graphics 520 Direct3D11 vs_5_0 ps_5_0"
    ];
    const vendors = ["AMD", "NVIDIA", "Intel"];
    return {
        renderer: renderers[Math.floor(Math.random() * renderers.length)],
        vendor: vendors[Math.floor(Math.random() * vendors.length)]
    };
}

function createOperatingSystem() {
    const osList = ["windows", "linux"];
    return osList[Math.floor(Math.random() * osList.length)];
}

export function createSystemData() {
    return {
        id: createUniqueId(26),
        type: "system",
        data: {
            gpuInfo: createGpuDetails(),
            memoryInfo: {
                availableCapacity: Math.floor(Math.random() * 1000000000) + 1000000000,
                capacity: Math.floor(Math.random() * 1000000000) + 2000000000
            },
            operatingSystem: createOperatingSystem(),
            machineId: createUniqueId(32).toLowerCase(),
            cpuInfo: createCpuDetails()
        }
    };
}