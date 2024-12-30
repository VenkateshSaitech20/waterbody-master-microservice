const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');
const prisma = new PrismaClient();

const upsertData = async (req, res) => {
    try {
        const slug = generateSlug(req.body.name);
        if (slug) {
            const isSlugExist = await prisma.master_activities_undertaken.findFirst({ where: { slug: slug, ...(req.body.id && { NOT: { id: parseInt(req.body.id) } }) } });
            if (isSlugExist) {
                return res.json({ result: false, message: { name: 'Name ' + respMsg.isAlreadyExist } });
            }
            req.body.slug = slug;
        }
        if (req.body.id) {
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.master_activities_undertaken.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Name ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.master_activities_undertaken.create({ data: req.body });
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
        let skip = (page - 1) * pageSize;
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
            const totalCount = await prisma.master_activities_undertaken.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            records = await prisma.master_activities_undertaken.findMany({
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
            records = await prisma.master_activities_undertaken.findMany({
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
        const ayacutnoncultivation = await prisma.master_activities_undertaken.findFirst({ where: { id }, select: { id: true, name: true, slug: true } });
        if (ayacutnoncultivation) {
            return res.json({ result: true, message: ayacutnoncultivation })
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
        const deletedAvailability = await prisma.master_activities_undertaken.delete({ where: { id } });
        if (deletedAvailability) {
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Name ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

module.exports = { upsertData, getData, getDataById, deleteData }