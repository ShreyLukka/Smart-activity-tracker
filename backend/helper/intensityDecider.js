

export function decideIntensity(duration){
    if(duration >0 && duration< 10){
        return "ignored"
    }
    if(duration >10 && duration <30){
        return "light"
    }
    if(duration >30 && duration <60){
        return "moderate"
    }
    return "intense"
}