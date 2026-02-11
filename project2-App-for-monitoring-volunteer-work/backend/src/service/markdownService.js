import db from "../models/index";
const createMarkdown = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId,
                });
                resolve({
                    errCode: 0,
                    errMessage: "Create markdown successfully",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    createMarkdown: createMarkdown,
};
