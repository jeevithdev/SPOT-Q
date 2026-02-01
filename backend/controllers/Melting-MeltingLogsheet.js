const MeltingLogsheet = require('../models/Melting-MeltingLogsheet');
const { ensureDateDocument, getCurrentDate } = require('../utils/dateUtils');

/** 1. SYSTEM INITIALIZATION **/

exports.initializeTodayEntry = async () => {
    try {
        await ensureDateDocument(MeltingLogsheet, getCurrentDate());
    } catch (error) {
        console.error('Melting Logsheet Init Error:', error.message);
    }
};

/** 2. DATA RETRIEVAL **/

exports.getPrimaryByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const document = await MeltingLogsheet.findOne({ date: new Date(date) });
        
        if (!document) return res.status(200).json({ success: true, data: null });

        res.status(200).json({
            success: true,
            data: {
                _id: document._id,
                date: document.date,
                shift: document.shift,
                furnaceNo: document.furnaceNo,
                panel: document.panel,
                cumulativeLiquidMetal: document.cumulativeLiquidMetal,
                finalKWHr: document.finalkwhr,
                initialKWHr: document.initialkwhr,
                totalUnits: document.totoalunits,
                cumulativeUnits: document.cumulativeunits,
                isLocked: document.isLocked
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.filterByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Start and end dates are required.' });
        }

        const documents = await MeltingLogsheet.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: -1 });

        // Flatten nested data structure for frontend consumption
        const flattened = documents.map(doc => ({
            _id: doc._id,
            date: doc.date,
            shift: doc.shift,
            furnaceNo: doc.furnaceNo,
            panel: doc.panel,
            cumulativeLiquidMetal: doc.cumulativeLiquidMetal,
            finalKWHr: doc.finalkwhr,
            initialKWHr: doc.initialkwhr,
            totalUnits: doc.totoalunits,
            cumulativeUnits: doc.cumulativeunits,
            isLocked: doc.isLocked,
            // Table 1 - Charging Details
            heatNo: doc.heatno,
            grade: doc.grade,
            chargingTime: doc.chargingkgs?.time,
            ifBath: doc.chargingkgs?.ifbath,
            liquidMetalPressPour: doc.chargingkgs?.liquidmetal?.presspour,
            liquidMetalHolder: doc.chargingkgs?.liquidmetal?.holder,
            sgMsSteel: doc.chargingkgs?.sqmssteel,
            greyMsSteel: doc.chargingkgs?.greymssteel,
            returnsSg: doc.chargingkgs?.returnSg,
            gl: doc.chargingkgs?.gl,
            pigIron: doc.chargingkgs?.pigiron,
            borings: doc.chargingkgs?.borings,
            finalBath: doc.chargingkgs?.finalbath,
            // Table 2 - Additions
            charCoal: doc.charcoal,
            cpcFur: doc.cpc?.fur,
            cpcLc: doc.cpc?.lc,
            siliconCarbideFur: doc.siliconcarbide?.fur,
            ferrosiliconFur: doc.ferroSilicon?.fur,
            ferrosiliconLc: doc.ferroSilicon?.lc,
            ferroManganeseFur: doc.ferroManganese?.fur,
            ferroManganeseLc: doc.ferroManganese?.lc,
            cu: doc.cu,
            cr: doc.cr,
            pureMg: doc.pureMg,
            ironPyrite: doc.ironPyrite,
            // Table 3 - Timing Details
            labCoinTime: doc.labCoin?.time,
            labCoinTempC: doc.labCoin?.tempC,
            deslagingTimeFrom: doc.deslagingTime?.from,
            deslagingTimeTo: doc.deslagingTime?.to,
            metalReadyTime: doc.metalReadyTime,
            waitingForTappingFrom: doc.waitingForTapping?.from,
            waitingForTappingTo: doc.waitingForTapping?.to,
            reason: doc.reason,
            // Table 4 - Metal Tapping
            time: doc.metalTapping?.time,
            tempCSg: doc.metalTapping?.tempCSg,
            tempCGrey: doc.metalTapping?.tempCGrey,
            directFurnace: doc.directFurnace,
            holderToFurnace: doc.holderToFurnace,
            furnaceToHolder: doc.furnaceToHolder,
            disaNo: doc.disaNo,
            item: doc.item,
            // Table 5 - Electrical Readings
            furnace1Kw: doc.electricalReadings?.furnace1?.kw,
            furnace1A: doc.electricalReadings?.furnace1?.a,
            furnace1V: doc.electricalReadings?.furnace1?.v,
            furnace4Hz: doc.electricalReadings?.furnace4?.hz,
            furnace4Gld: doc.electricalReadings?.furnace4?.gld,
            furnace4KwHr: doc.electricalReadings?.furnace4?.kwhr
        }));

        res.status(200).json({ success: true, data: flattened });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** 3. THE "DYNAMIC" TABLE UPDATER **/

exports.createTableEntry = async (req, res) => {
    try {
        const { tableNum, primaryData, data } = req.body;
        if (!tableNum || !data || !primaryData?.date) {
            return res.status(400).json({ success: false, message: 'Table number, data, and date are required.' });
        }

        // Normalize the date
        const [year, month, day] = primaryData.date.split('-').map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

        // Find existing document by date - should only have one per date
        let document = await MeltingLogsheet.findOne({ date: dateObj });
        
        if (!document) {
            // Create new document with date only if it doesn't exist
            document = await MeltingLogsheet.create({ date: dateObj });
        }

        // Map Table Numbers to Model Schema Paths
        const updateMap = {
            1: { // Charging Details
                heatno: data.heatNo,
                grade: data.grade,
                chargingkgs: {
                    time: data.chargingTime,
                    ifbath: data.ifBath,
                    liquidmetal: { presspour: data.liquidMetalPressPour, holder: data.liquidMetalHolder },
                    sqmssteel: data.sgMsSteel,
                    greymssteel: data.greyMsSteel,
                    returnSg: data.returnsSg,
                    gl: data.gl,
                    pigiron: data.pigIron,
                    borings: data.borings,
                    finalbath: data.finalBath
                }
            },
            2: { // Additions
                charcoal: data.charCoal,
                cpc: { fur: data.cpcFur, lc: data.cpcLc },
                siliconcarbide: { fur: data.siliconCarbideFur },
                ferroSilicon: { fur: data.ferrosiliconFur, lc: data.ferrosiliconLc },
                ferroManganese: { fur: data.ferroManganeseFur, lc: data.ferroManganeseLc },
                cu: data.cu, cr: data.cr, pureMg: data.pureMg, ironPyrite: data.ironPyrite
            },
            3: { // Timing Details
                labCoin: { time: data.labCoinTime, tempC: data.labCoinTempC },
                deslagingTime: { from: data.deslagingTimeFrom, to: data.deslagingTimeTo },
                metalReadyTime: data.metalReadyTime,
                waitingForTapping: { from: data.waitingForTappingFrom, to: data.waitingForTappingTo },
                reason: data.reason
            },
            4: { // Metal Tapping
                metalTapping: { time: data.time, tempCSg: data.tempCSg, tempCGrey: data.tempCGrey },
                directFurnace: data.directFurnace,
                holderToFurnace: data.holderToFurnace,
                furnaceToHolder: data.furnaceToHolder,
                disaNo: data.disaNo,
                item: data.item
            },
            5: { // Electrical Readings
                electricalReadings: {
                    furnace1: { kw: data.furnace1Kw, a: data.furnace1A, v: data.furnace1V },
                    furnace4: { hz: data.furnace4Hz, gld: data.furnace4Gld, kwhr: data.furnace4KwHr }
                }
            }
        };

        const updateData = updateMap[tableNum];
        if (!updateData) return res.status(400).json({ success: false, message: 'Invalid Table Number' });

        // Deep merge the section into the document
        Object.assign(document, updateData);
        await document.save();

        res.status(200).json({ success: true, data: document, message: `Table ${tableNum} updated.` });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/** 4. LOCKING & PRIMARY UPDATES **/

exports.createOrUpdatePrimary = async (req, res) => {
    try {
        const { primaryData, isLocked } = req.body;
        const document = await ensureDateDocument(MeltingLogsheet, primaryData.date);

        // Map primary fields (handling initial units and power metrics)
        document.shift = primaryData.shift || document.shift;
        document.furnaceNo = primaryData.furnaceNo || document.furnaceNo;
        document.panel = primaryData.panel || document.panel;
        document.cumulativeLiquidMetal = primaryData.cumulativeLiquidMetal !== undefined ? primaryData.cumulativeLiquidMetal : document.cumulativeLiquidMetal;
        document.initialkwhr = primaryData.initialKWHr || document.initialkwhr;
        document.finalkwhr = primaryData.finalKWHr || document.finalkwhr;
        document.totoalunits = primaryData.totalUnits !== undefined ? primaryData.totalUnits : document.totoalunits;
        document.cumulativeunits = primaryData.cumulativeUnits !== undefined ? primaryData.cumulativeUnits : document.cumulativeunits;
        document.isLocked = isLocked !== undefined ? isLocked : document.isLocked;

        await document.save();
        res.status(200).json({ success: true, data: document });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};