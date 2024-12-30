const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');
const prisma = new PrismaClient();

const upsertData = async (req, res) => {
    try {
        const slug = generateSlug(req.body.name);
        if (slug) {
            const isSlugExist = await prisma.master_encroachers_living_standard.findFirst({ where: { slug: slug, ...(req.body.id && { NOT: { id: parseInt(req.body.id) } }) } });
            if (isSlugExist) {
                return res.json({ result: false, message: { name: 'Name ' + respMsg.isAlreadyExist } });
            }
            req.body.slug = slug;
        }
        if (req.body.id) {
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.master_encroachers_living_standard.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Name ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.master_encroachers_living_standard.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Name ' + respMsg.addedSuccess })
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const getData = async (req, res) => {
    try {
        const { searchText, page, pageSize } = req.body;
        const queryFilter = {
            AND: [
                ...(searchText ? [
                    {
                        OR: [
                            { name: { contains: searchText } }
                        ]
                    }
                ] : [])
            ]
        };
        let records;
        let totalPages;
        if (page && pageSize) {
            let skip = (page - 1) * pageSize;
            const totalCount = await prisma.master_encroachers_living_standard.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            records = await prisma.master_encroachers_living_standard.findMany({
                where: queryFilter,
                skip,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            });
        } else {
            records = await prisma.master_encroachers_living_standard.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            });
        }
        if (records) {
            return res.json({ result: true, message: records, totalPages: totalPages ?? totalPages });
        } else {
            return res.json({ result: true, message: respMsg.noDataFound });
        }

    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const getDataById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const availability = await prisma.master_encroachers_living_standard.findFirst({ where: { id }, select: { id: true, name: true, slug: true } });
        if (availability) {
            return res.json({ result: true, message: availability })
        } else {
            return res.json({ result: true, message: respMsg.noDataFound });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const deleteData = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedAvailability = await prisma.master_encroachers_living_standard.delete({ where: { id } });
        if (deletedAvailability) {
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Name ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        if (error.code === 'P2025') {
            return res.json({ result: false, message: respMsg.noDataFound });
        }
        return res.json({ result: false, message: error });
    }
}

module.exports = { upsertData, getData, getDataById, deleteData }