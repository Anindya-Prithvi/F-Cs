import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
    const navigate = useNavigate()
    const Message404 = () => {
        const messages = ["Oops! It looks like you've wandered off the beaten path. Let's get you back on track.",
            "Lost in cyberspace? Don't worry, we'll help you find your way.",
            "404 Error: The page you're looking for seems to be missing. How about exploring our popular content instead?",
            "The page you're seeking is in another castle! But we've got plenty of interesting content here.",
            "Houston, we have a problem. The page you requested is MIA, but we have some awesome articles you might like!",
            "We couldn't find what you were looking for, but our blog has plenty of hidden gems. Check it out!",
            "This is not the webpage you're looking for. But we have great stuff waiting for you - just a click away.",
            "Whoops! The page you tried to access seems to have taken a coffee break. How about some trending stories instead?",
            "404 Error: The page seems to have vanished into thin air. Explore our site's main sections to discover something new!",
            "Nope..This is not a ctf darling",
            "Looks like a wrong turn! Let us help you navigate back to our homepage, or you can use our search bar to find what you need."]

        return (
            <h1>{messages[Math.floor(Math.random() * messages.length)]}</h1>
        )
    }

    useEffect(() => {
        setTimeout(() => {
            navigate('/')
        }, 10000)
    }, [])

    return (
        <>
            <Message404 />
        </>
    )
}

export default Error404