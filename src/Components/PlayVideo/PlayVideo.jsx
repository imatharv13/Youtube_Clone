import React, { useEffect } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import valueConverter, { API_KEY } from '../../data'
import { useState } from 'react'
import moment from 'moment'
import { useParams } from 'react-router-dom'


const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData,setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentsData, setCommentsData] = useState([]);

    const fetchVideoData = async() => {
       const viedo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
       await fetch(viedo_url).then(response => response.json()).then(data => setApiData(data.items[0] || null));
    }

    const fetchOtherData = async () =>{
        if (!apiData?.snippet?.channelId) return; 
        const channelData_url= `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
        await fetch(channelData_url).then(response => response.json()).then(data => setChannelData(data.items[0] || null));
    }

    const fetchCommentsData = async () => {
    const comments_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResults=20&videoId=${videoId}&key=${API_KEY}`;
    const response = await fetch(comments_url);
    const data = await response.json();
    setCommentsData(data.items || []);
};
    useEffect(() => {
        fetchVideoData();
    },[videoId]) //fetch video data when videoId changes

    useEffect(() => {
        fetchOtherData();
    }, [apiData]) //fetch channel data when apiData changes

    useEffect(() => {
        fetchCommentsData();
    }, [apiData])

  return (
    <div className='play-video'>
        {/* <video src={video} controls muted autoPlay></video> */}
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
        <div className="play-video-info">
            <p>
  {apiData ? valueConverter(apiData.statistics.viewCount) : "16 K"} 
    &nbsp; &bull;  &nbsp;
  {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
</p>

            <div>
                <span><img src={like} alt="" />{apiData?valueConverter(apiData.statistics.likeCount) :"159"}</span>
                <span><img src={dislike} alt="" />15</span>
                <span><img src={share} alt="" />Share</span>
                <span><img src={save} alt="" />Save</span>
            </div>
        </div>
        <hr />
        <div className="publisher">
            <img src={channelData?.snippet?.thumbnails?.default?.url || null} alt="" />
            <div>
                <p>{apiData?apiData.snippet.channelTitle:"Channel Name"}</p>
                <span>{channelData?valueConverter(channelData.statistics.subscriberCount):"1M"} Subscriber</span>
            </div>
              <button >Subscribe</button>
        </div>
      <div className="vid-description">
        <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
        <hr />
        <h4>{apiData?valueConverter(apiData.statistics.commentCount):102}</h4>
        <br />
        {commentsData?.map((item,index) => {
            return(
                <div key={index} className="comment">
            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
            <div>
                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span> 1 Day ago</span></h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                    <img src={like} alt="" />
                    <span>{valueConverter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                    <img src={dislike} alt="" />
                    <span>0</span>
                </div>
            </div>
        </div>
            )
        })}
        
      </div>
    </div>
  )
}

export default PlayVideo
