import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tweetService from '../services/tweet.service'
import { Container, TweetDetailCard } from '../components'

function TweetPage() {
    const { tweetId } = useParams()
    const [tweet, setTweet] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTweet = async () => {
            try {
                const data = await tweetService.getTweetById(tweetId)
                if (data) setTweet(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchTweet()
    }, [tweetId])

    if (loading) return <div className="p-10 text-center">Loading Tweet...</div>

    return (
        <div className="w-full">
            <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <button onClick={() => window.history.back()} className="text-xl">←</button>
                <h1 className="text-xl font-bold">Tweet</h1>
            </div>
            
            <TweetDetailCard tweet={tweet} />
            
            {/* 📝 Future Step: Insert CommentForm and CommentList here */}
            <div className="p-10 text-center text-gray-500">
                Comments are coming soon...
            </div>
        </div>
    )
}

export default TweetPage