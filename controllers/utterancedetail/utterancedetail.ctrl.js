const {models, UtteranceDetail} = require('../../models')

exports.create_utterance_detail = async (req, res) => {
    const {utterance, detail} = req.body
    try {
        const utteranceDetail = await UtteranceDetail.create({
            utterance: utterance,
            action: detail['action'],
            object: detail['object'],
            location: detail['location']
        })
        return res.json(utteranceDetail)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

// exports.name = async (req, res) => {
//     try {
//     } catch (err) {
//         console.log(err)
//         return res.status(500).json(err)
//     }
// }