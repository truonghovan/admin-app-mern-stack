import React from 'react'
import { Col, Container, Jumbotron, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import './style.css'

/**
* @author
* @function Home
**/

export const Home = (props) => {
  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col md={2} className='sidebar'>
            <ul>
              <li><NavLink to={'/'}>Home</NavLink></li>
              <li><NavLink to={'/page'}>Page</NavLink></li>
              <li><NavLink to={'/category'}>Category</NavLink></li>
              <li><NavLink to={'/products'}>Products</NavLink></li>
              <li><NavLink to={'/orders'}>Orders</NavLink></li>
            </ul>
          </Col>
          <Col md={10}>Container</Col>
        </Row>
      </Container>


      {/* <Jumbotron className="text-center" style={{margin:'5rem',background:'#fff'}} >
            <h1>Welcome to Admin DashBoard</h1>
        </Jumbotron> */}

    </Layout>
  )

}