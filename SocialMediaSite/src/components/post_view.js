import React, { useEffect, useState } from 'react'

function PostView(props) {

    // definitions of usestate lies here
    const item = localStorage.getItem('name');
    const [sendingPostName, setsendingPostName] = useState('');
    const [sendingPostDescription, setsendingPostDescription] = useState('')
    const [comment, setComment] = useState('')
    const [sendingFile, setsendingFile] = useState(null);
    const [fresh, setFresh] = useState(1);
    const [postDetails, setPostDetails] = useState(null)
    // const [postUrl, setPostUrl] = useState(null)
    // const [error, setError] = useState(false);

    //code to fetch the all the posts with their respective comments 
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch("http://192.168.165.164:5010/posts/getComments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const postData = await response.json();
                setPostDetails(postData);
                // console.log(postData);
                // console.log("the received data is", postData);
                // const uris = postData.posts.map(pt => arrayBufferToUri(pt.PSTPic.data));
                // console.log("the parsed url", uris);
                // setPostUrl(uris);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (props) {
            fetchPostDetails();
        }
        return () => setPostDetails(null)

    }, [props, fresh]);

    function refresh() {
        setFresh(fresh + 1);
    }

    // *********the below codes are for further working on the image transfer technique */
    // const arrayBufferToUri = (arrayBuffer) => {
    //     const blob = new Blob([new Uint8Array(arrayBuffer)], { type: 'image/jpeg' });
    //     let createdUrl = URL.createObjectURL(blob);
    //     const cleanedUrl = createdUrl.replace("blob:", "");
    //     return cleanedUrl;
    // };


    //code to add new post created by the user to the  server
    const handleFileChange = (e) => {
        setsendingFile(e.target.files[0]);
    };
    const formData = new FormData();
    const jsonData = { PSTName: sendingPostName, description: sendingPostDescription };
    formData.append('json_data', JSON.stringify(jsonData));
    formData.append('file', sendingFile);
    const addPost = async (e) => {
        e.preventDefault();
        const response = await fetch("http://192.168.165.164:5010/posts/addPost", {
            method: "POST",
            headers: {
                "auth-token": props.atlp
            },
            body: formData
        });
        const obtainedData = await response.json();
        if (obtainedData.Posted && obtainedData.authentication) {
            refresh();
        }
        else if (!obtainedData.Posted && obtainedData.authentication) {
            alert("some error occurred while posting");
        }
        else {
            alert("unauthorized user id trying to post")
        }
    }

    //code to add the comments  to the database
    const addComment = async (event) => {
        const postId = await event.target.getAttribute('name');
        const response = await fetch("http://192.168.165.164:5010/posts/updateComments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": props.atlp
            },
            body: JSON.stringify({
                "postID": postId,
                "commentSent": {
                    "commenterUname": item,
                    "comment": comment
                }
            })
        });
        const data = await response.json();
        if (data.status) {
            setComment('')
            refresh();
        }
        else {
            alert("comment was not updated");
        }
    }

    if (!postDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div id='publicPostSection'>
            <div id="postControls">
                <p>POST</p>
                <div id="pheadding">
                    <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <span class="material-symbols-outlined">
                            add_box
                        </span>
                    </button>
                    <button onClick={refresh}>
                        <span class="material-symbols-outlined">
                            refresh
                        </span>
                    </button>
                </div>
            </div>
            <div className="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Post</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form action="" onSubmit={addPost}>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-default">Post Name</span>
                                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={sendingPostName} onChange={(e) => setsendingPostName(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="file" className="form-control" id="inputGroupFile02" onChange={handleFileChange} required />
                                    <label className="input-group-text" for="inputGroupFile02" >Upload</label>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-default">Description</span>
                                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={sendingPostDescription} onChange={(e) => setsendingPostDescription(e.target.value)} required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                {/* <button type="submit" className="btn btn-primary" onClick={addPost}>Upload Post</button> */}
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" >Upload Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div id="postsHolder">
            {postDetails.posts.map(pst => (
                <div className="postTemplate">
                    <h2>{pst.PSTName}</h2>
                    <h5>{pst.PSTUname}</h5>
                    <div className="individualPost">
                    <img src={`http://192.168.165.164:5010/images/${pst.PSTPic}`} alt="Fetched" typeof='image/jpeg' />
                    </div>
                    <div className="postDescription">
                        <p>{pst.description}</p>
                    </div>
                    <div className="postComments">
                        <p id='hedin' >Comments</p>
                    </div>
                    {pst.comments.map(comm => (
                        <div className="postComments">
                            <img src="./images/image.png" alt="" />
                            <div className="commentercomment">
                                <p><b>{comm.commenterUname}</b></p>
                                <p>{comm.comment}</p>
                            </div>
                        </div>
                    ))}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">your comment</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={comment} onChange={(e) => setComment(e.target.value)} />
                        <button type="button" name={pst.PSTId} className="btn btn-primary btn-sm" onClick={addComment}>send</button>
                    </div>
                </div>
            ))}
            </div>
        </div>

    )
}

export default PostView;