import React from 'react'
import { Button, Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import './Dashboard.css'
const Dashboard = () => {
    return (
        <>
            <h1>Welcome to CodeFusion</h1>
            <h2>My Past Projects</h2>
            <div className='card-div'>
                <Card
                    style={{
                        width: '18rem',
                        margin: '10px'

                    }}
                >
                    <img
                        alt="Sample"
                        src="https://picsum.photos/300/200"
                    />
                    <CardBody>
                        <CardTitle tag="h5">
                            Card title
                        </CardTitle>
                        <CardSubtitle
                            className="mb-2 text-muted"
                            tag="h6"
                        >
                            Card subtitle
                        </CardSubtitle>
                        <CardText>
                            Some quick example text to build on the card title and make up the bulk of the card‘s content.
                        </CardText>
                        <Button>
                            Button
                        </Button>
                    </CardBody>
                </Card>
                <Card
                    style={{
                        width: '18rem',
                        margin: '10px'
                    }}
                >
                    <img
                        alt="Sample"
                        src="https://picsum.photos/300/200"
                    />
                    <CardBody>
                        <CardTitle tag="h5">
                            Card title
                        </CardTitle>
                        <CardSubtitle
                            className="mb-2 text-muted"
                            tag="h6"
                        >
                            Card subtitle
                        </CardSubtitle>
                        <CardText>
                            Some quick example text to build on the card title and make up the bulk of the card‘s content.
                        </CardText>
                        <Button>
                            Button
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}
export default Dashboard;