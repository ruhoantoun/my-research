
import markdownService from '../service/markdownService';
let handleCreateMarkdown = async (req, res) => {
    try {
        // console.log('check req', req.body);
        let response = await markdownService.createMarkdown(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};
module.exports = {
handleCreateMarkdown: handleCreateMarkdown
};
