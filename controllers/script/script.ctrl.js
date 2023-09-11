const {models, Script, User} = require('../../models')
const fs = require("fs");
const { parse } = require("csv-parse");

exports.get_one_script_by_id = async (req, res) => {
    const {script_id} = req.body
    try {
        const script = await Script.findByPk(script_id)
        return res.json(script)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.assign_task_to_multiple_users = async (req, res) => {
    const {user_ids, script_id} = req.body

    console.log("user_ids: ", user_ids)
    console.log("assign_multiple_tasks: ", script_id)

    try {
        const return_users = []

        for (var i = 0; i < user_ids.length; i++) {
            var user_id = user_ids[i]
            console.log("user_id: ", user_id)
            const user = await User.findByPk(user_id)

            // if user not found, show error
            if (user === null) {
                console.log("user not found!")
            }

            const original_assigned_tasks = user.assignedTasks.tasks
            console.log("original: ", original_assigned_tasks)

            original_assigned_tasks.push(script_id)
            user.assignedTasks.tasks = original_assigned_tasks
            user.changed('assignedTasks', true)
            await user.save()
            return_users.push(user)
        }
    
        return res.json(return_users)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.delete_script = async (req, res) => {
    const {script_id} = req.body
    try {
        const script = await Script.destroy({where : {id : script_id}})
        return res.json(script)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.get_script_total_number = async (_, res) => {
    try {
        return res.json(await Script.count());
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.update_assigned_task = async (req, res) => {
    const {user_id, script_ids} = req.body

    try {
        const user = await User.findByPk(user_id)
        console.log("user: ", user)

        // if user not found, show error
        if (user === null) {
            console.log("user not found!")
        }

        const scripts_to_update = await Promise.all(
            script_ids.map(async (script_id) => {
                var script = await Script.findByPk(script_id);

                // if script not found, show error
                if (script === null) {
                    console.log("script not found!")
                    return;
                }

                return script_id;
            })
        )

        console.log("scripts_to_update: ", scripts_to_update);

        const original_assigned_tasks = user.assignedTasks.tasks
        console.log(original_assigned_tasks)

        user.assignedTasks.tasks = scripts_to_update
        user.changed('assignedTasks', true)
        await user.save()
    
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.get_all_scripts = async (_, res) => {
    try {
        return res.json(await Script.findAll());
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.get_all_script_ids = async (_, res) => {
    try {
        return res.json(await Script.findAll({attributes: ['id']}));
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.create_script = async (req, res) => {

    console.log("create script")

    const {id, utterances} = req.body
    console.log(req.body)
    try {
        const script = await Script.create({id, utterances})
        return res.json(script)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.unassign_task = async (req, res) => {
    const {user_id, script_id} = req.body

    try {
        const user = await User.findByPk(user_id)
        console.log("user: ", user)

        // if user not found, show error
        if (user === null) {
            console.log("user not found!")
        }

        const script = await Script.findByPk(script_id)

        // if script not found, show error
        if (script === null) {
            console.log("script not found!")
        }

        const original_assigned_tasks = user.assignedTasks.tasks
        console.log(original_assigned_tasks)

        if (!original_assigned_tasks.includes(script_id)) {
            console.log("error")
            return res.json(user)
        }

        const idx = original_assigned_tasks.indexOf(script_id)
        if (idx > -1) {
            original_assigned_tasks.splice(idx, 1)
        }
        
        user.assignedTasks.tasks = original_assigned_tasks
        user.changed('assignedTasks', true)
        await user.save()
    
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

// not in use
exports.process_script = async (req, res) => {

    const {data} = req.body

    console.log("req.body: ", req.body)
    console.log("process_script data: ", data)



    // try {
    //     fs.createReadStream(file.name)
    //     .pipe(parse({ delimiter: ",", from_line: 2 }))
    //     .on("data", function (row) {
    //         console.log(row);
    //     })
    //     .on("error", function (error) {
    //         console.log(error.message);
    //     })
    //     .on("end", function () {
    //         console.log("finished");
    //     });
    // } catch (err) {
    //     console.log(err)
    //     return res.status(500).json(err)
    // }
}

exports.add_utterances = async (req, res) => {

    const isScriptIDUnique = async (script_id) => {
        console.log("script_id: ", script_id)
        return await Script.count({ where: { id: script_id } });
    };

    try {
        const {script_id, utterances} = req.body

        const checkExistID = await isScriptIDUnique(script_id)
        // console.log("checkExistID: ", checkExistID)

        // a script of this script id already exists
        if (checkExistID > 0) {

            try {
                console.log("update script")

                const script = await Script.findByPk(script_id)
                script.utterances.utterances.push(utterances.utterances)
                script.utterances.details.push(utterances.details)

                await script.save()

                return res.json(script)

            } catch (err) {

                console.log(err)
                return res.status(500).json(err)

            }

        } else { // a script of this script id does not yet exist
            try {
                console.log("create new script script_id: ", script_id)
                const script = await Script.create({id: script_id, utterances: utterances})
                return res.json(script)
            } catch (err) {
                console.log(err)
                return res.status(500).json(err)
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }

}

exports.update_script = async (req, res) => {

    const {script_id, utterances} = req.body

    const isScriptIDUnique = async () => {
        console.log("script_id: ", script_id)
        return await Script.count({ where: { id: script_id } });
    };

    try {
        const checkExistID = await isScriptIDUnique(script_id)
        // console.log("checkExistID: ", checkExistID)

        // a script of this script id already exists
        if (checkExistID > 0) {

            try {
                console.log("update script")

                const script = await Script.findByPk(script_id)
                script.utterances = utterances

                await script.save()

                return res.json(script)

            } catch (err) {

                console.log(err)
                return res.status(500).json(err)

            }

        } else { // a script of this script id does not yet exist
            try {
                console.log("create new script")
                const script = await Script.create({id, utterances})
                return res.json(script)
            } catch (err) {
                console.log(err)
                return res.status(500).json(err)
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }

}

exports.update_script_line = async (req, res) => {

    console.log("update_script_line")

    const {script_id, line_number, new_utterance, new_details} = req.body

    try {
        const script = await Script.findByPk(script_id);

        script.utterances.utterances[line_number] = new_utterance;
        script.utterances.details[line_number] = new_details;

        script.changed('utterances', true)
        await script.save()
        return res.json(script)
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