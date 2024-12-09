const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');
const prisma = new PrismaClient();

const upsertData = async (req, res) => {
    try {
        const slug = generateSlug(req.body.name);
        if (slug) {
            const isSlugExist = await prisma.master_ayacutnoncultivation.findFirst({ where: { slug: slug, ...(req.body.id && { NOT: { id: parseInt(req.body.id) } }) } });
            if (isSlugExist) {
                return res.json({ result: false, message: { name: 'Ayacutnoncultivation ' + respMsg.isAlreadyExist } });
            }
            req.body.slug = slug;
        }
        if (req.body.id) {
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.master_ayacutnoncultivation.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Ayacutnoncultivation ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.master_ayacutnoncultivation.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Ayacutnoncultivation ' + respMsg.addedSuccess })
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
        let availabilities;
        let totalPages;
        if (page && pageSize) {
            const totalCount = await prisma.master_ayacutnoncultivation.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            availabilities = await prisma.master_ayacutnoncultivation.findMany({
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
            availabilities = await prisma.master_ayacutnoncultivation.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            });
        }
        if (availabilities) {
            return res.json({ result: true, message: availabilities, totalPages: totalPages ?? totalPages });
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
        const ayacutnoncultivation = await prisma.master_ayacutnoncultivation.findFirst({ where: { id }, select: { id: true, name: true, slug: true } });
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
        const deletedAvailability = await prisma.master_ayacutnoncultivation.delete({ where: { id } });
        if (deletedAvailability) {
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Ayacutnoncultivation ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

module.exports = { upsertData, getData, getDataById, deleteData }