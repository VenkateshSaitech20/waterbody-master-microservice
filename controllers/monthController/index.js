const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMonth = async (req, res) => {
    try {
        const months = await prisma.months.findMany({ select: { id: true, month: true } });
        res.status(200).json({ result: true, message: months });
    } catch (error) {
        return res.status(200).json({ result: false, message: error });
    }
}

module.exports = { getMonth }