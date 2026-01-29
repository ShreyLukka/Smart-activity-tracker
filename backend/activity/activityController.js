import { decideIntensity } from '../helper/intensityDecider.js'
import { intensityPoints } from '../helper/intensityPoints.js'
import { activityModel } from './activitySchema.js';
import { summaryModel } from './summarySchema.js';

export async function addNewActivity(req, res) {

    try {

        const { userId, activity, duration } = req.body;

        if (activity.trim() == "") {
            return res.status(400).json({ success: false, message: "Activity name cannot be empty" })
        }
        if (Number(duration) < 1 || Number(duration) > 300) {
            return res.status(400).json({ success: false, message: "Duration must be between 1 and 300" })
        }

        //Prevenet duplicate for 2 min
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        const recentDuplicate = await activityModel.findOne({
            userId,
            activity,
            createdAt: { $gte: twoMinutesAgo }
        });

        if (recentDuplicate) {
            return res.status(400).json({
                success: false, message: "Same activity cannot be submitted within 2 minutes"
            });
        }


        const intensity = decideIntensity(duration);
        const newActivity = await activityModel.create({
            userId,
            activity,
            duration,
            intensity
        })

        const today = new Date().toISOString().slice(0, 10);

        let summary = await summaryModel.findOne({ userId, date: today });

        if (!summary) {
            summary = await summaryModel.create({ userId, date: today });
        }
        summary.totalActivitiesToday += 1;

        if (intensity !== "ignored") {
            summary.totalActiveMinutes += duration;
            summary.intensityScore += intensityPoints[intensity] || 0;
        }

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const todayEnd = new Date()
        todayEnd.setHours(23, 59, 59, 999)

        //check and save dominant activity
        const result = await activityModel.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: todayStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: "$activity",
                    totalDuration: { $sum: "$duration" }
                }
            },
            { $sort: { totalDuration: -1 } }
        ])

        const dominantActivity = result[0]?._id || null
        summary.dominantActivity = dominantActivity

        //Recent five activities

        const latest5 = await activityModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)

        await summary.save()


        return res.status(201).json({ saved: true, activity: newActivity, summary, latest5 })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

