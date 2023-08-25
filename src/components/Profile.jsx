import React from "react";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBTypography,
    MDBIcon,
    MDBBtn,
} from "mdb-react-ui-kit";
import http from "../http-common";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import instagramIcon from "../images/instagram.png"
import facebookIcon from "../images/facebook.png"
export default function PersonalProfile() {
    const [profile, setProfile] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (isLoggedIn) {
          http
            .get(`/${user._id}`) // Replace with your backend API endpoint
            .then((response) => {
              setProfile(response.data);
              setTotalEvents(response.data.events.length);
            })
            .catch((error) => console.log(error));
        }
      }, [isLoggedIn, user]);

      return isLoggedIn && user ?(
        <div style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="container py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol md="12" xl="4">
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="text-center">
                  <div className="mt-3 mb-4">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                      className="rounded-circle" fluid style={{ width: '100px' }} />
                  </div>
                  <MDBTypography tag="h4"> {user.fname} {user.lname}</MDBTypography>
                  <MDBCardText className="text-muted mb-4">
                    {user.username}
                  </MDBCardText>
                  <div className="mb-4 pb-2">
                    {user.socials.instagram ? (
                    <a href={`https://instagram.com/${user.socials.instagram}`} target="_blank" rel="noopener noreferrer">
                        <img  src={instagramIcon} width="30" height = "30" style={{ marginRight: '0.5rem' }}/>
                    </a>
                  ) : (
                    <img  src={instagramIcon} width="30" height = "30" style={{ marginRight: '0.5rem' }}/>
                   )}
                    {user.socials.facebook ? (
                    <a href={`https://facebook.com/${user.socials.facebook}`} target="_blank" rel="noopener noreferrer">
                    <img  src={facebookIcon} width="30" height = "30" style={{ marginLeft: '0.5rem' }}/>
                    </a>
                  ) : (
                    <img  src={facebookIcon} width="30" height = "30" style={{ marginLeft: '0.5rem' }}/>
                  )}
                  </div>
                  <div className="d-flex justify-content-between text-center mt-5 mb-2">
                    <div>
                      <MDBCardText className="mb-1 h5">{user.email}</MDBCardText>
                      <MDBCardText className="small text-muted mb-0">Email</MDBCardText>
                    </div>
                    <div className="px-3">
                      <MDBCardText className="mb-1 h5">{user.role}</MDBCardText>
                      <MDBCardText className="small text-muted mb-0">Role</MDBCardText>
                    </div>
                    <div>
                      <Link to={`/user-events`} style={{ textDecoration: 'none', color: 'red' }}><MDBCardText className="mb-1 h5">{totalEvents}</MDBCardText></Link>
                      <MDBCardText className="small text-muted mb-0">Pending Events</MDBCardText>
                    </div>
                  </div><br></br>
                  {/* <iframe style={{borderRadius:12}} src="https://open.spotify.com/embed/playlist/2iSjT2Mh37vCo0GkPbn30V?si=4fa7881f7af94248" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>                   */}
                  <Link to={`/edit/${user._id}`}><br></br>
                  <button type="button" className="btn btn-outline-info">Edit Profile</button>
                  </Link>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    ) : (
        <div>Loading...</div> // Or any loading indicator while the user object is null
    );
    
}
