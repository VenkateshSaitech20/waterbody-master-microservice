const { PrismaClient } = require('@prisma/client');
const respMsg = require('../../utils/message');
const { generateSlug } = require('../../utils/helper');
const { updateApiDataVersion } = require('../../utils/api-data-version');
const prisma = new PrismaClient();

const upsertAvailability = async (req, res) => {
    try {
        const slug = generateSlug(req.body.name);
        if (slug) {
            const isSlugExist = await prisma.master_availability.findFirst({ where: { slug: slug, ...(req.body.id && { NOT: { id: parseInt(req.body.id) } }) } });
            if (isSlugExist) {
                return res.json({ result: false, message: { name: 'Availability ' + respMsg.isAlreadyExist } });
            }
            req.body.slug = slug;
        }
        if (req.body.id) {
            req.body.updatedBy = String(req.user.id);
            req.body.updatedAt = new Date();
            await prisma.master_availability.update({ where: { id: req.body.id }, data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Availability ' + respMsg.updatedSuccess })
        } else {
            req.body.createdBy = String(req.user.id);
            await prisma.master_availability.create({ data: req.body });
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Availability ' + respMsg.addedSuccess })
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const getAvailability = async (req, res) => {
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
        let availabilities;
        let totalPages;
        if (page && pageSize) {
            let skip = (page - 1) * pageSize;
            const totalCount = await prisma.master_availability.count({ where: queryFilter });
            if (skip >= totalCount) {
                skip = totalCount - pageSize;
            }
            if (skip < 0) skip = 0;
            totalPages = Math.ceil(totalCount / pageSize);
            availabilities = await prisma.master_availability.findMany({
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
            availabilities = await prisma.master_availability.findMany({
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

const getAvailabilityById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const availability = await prisma.master_availability.findFirst({ where: { id }, select: { id: true, name: true, slug: true } });
        if (availability) {
            return res.json({ result: true, message: availability })
        } else {
            return res.json({ result: true, message: respMsg.noDataFound });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

const deleteAvailability = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedAvailability = await prisma.master_availability.delete({ where: { id } });
        if (deletedAvailability) {
            await updateApiDataVersion(req.user.id);
            return res.json({ result: true, message: 'Availability ' + respMsg.deletedSuccess });
        }
    } catch (error) {
        return res.json({ result: false, message: error });
    }
}

module.exports = { upsertAvailability, getAvailability, getAvailabilityById, deleteAvailability }