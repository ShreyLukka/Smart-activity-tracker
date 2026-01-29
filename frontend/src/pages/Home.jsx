import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function Home() {

    const [activity, setActivity] = useState("")
    const [duration, setDuration] = useState("")
    const [summary, setSummary] = useState(null)
    const [lastRecent5Activity, setLastRecent5Activity] = useState([])

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            const res = await axios.post("http://localhost:3000/activity", {
                userId: "u123", activity, duration: Number(duration)
            })
            
            setSummary(res.data.summary)
            setLastRecent5Activity(res.data.latest5)
            setActivity("")
            setDuration("")
            toast.success("activity saved!")
        } catch (err) {
            console.log("error", err)
            toast.error(err.response.data.message)
        }
    }

    return (
        <div className="">
            <h3> Hello,Welcome To Smart Activity Tracker</h3>
            {/* activity form */}
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="e.g.Running" value={activity} onChange={(e) => setActivity(e.target.value)}></input>
                    <input type="number" placeholder="Enter Duration for the activity" value={duration} onChange={(e) => setDuration(e.target.value)}></input>
                    <button>Add Activity</button>
                </form>
            </div>
            <hr />

            <div>
                {/* daily summary */}
                <div>
                    {summary && (
                        <div>
                            <h3>Today's Summary</h3>
                            <ul>
                                <li className='summary-list'>Date: {summary.date}</li>
                                <li className='summary-list'>Total Activities: {summary.totalActivitiesToday}</li>
                                <li className='summary-list'>Total Active Minutes: {summary.totalActiveMinutes}</li>
                                <li className='summary-list'>Dominant Activity: {summary.dominantActivity}</li>
                                <li className='summary-list'>Intensity Score: {summary.intensityScore}</li>
                            </ul>
                        </div>
                    )}

                </div>
                <hr />
                {/* recent activity */}
                <div>
                    {lastRecent5Activity.map((act) => (
                        <ul key={act._id}>
                            <li className='latest5-list'>{act.activity} - {act.duration} min </li>
                        </ul>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home