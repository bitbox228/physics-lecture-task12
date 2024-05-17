import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Form, Button} from 'react-bootstrap';

const App = () => {

    const [r, setR] = useState(10)
    const [n0, setN0] = useState(1)
    const [n1, setN1] = useState(2)
    const [n2, setN2] = useState(3)
    const [lambda, setLambda] = useState(1000)
    const [rad, setRad] = useState(0.001)

    const [i, setI] = useState()
    const [x, setX] = useState()


    const handleRChange = (e) => {
        setR(parseFloat(e.target.value))
    }

    const handleN0Change = (e) => {
        setN0(parseFloat(e.target.value))
    }

    const handleN1Change = (e) => {
        setN1(parseFloat(e.target.value))
    }

    const handleN2Change = (e) => {
        setN2(parseFloat(e.target.value))
    }

    const handleLambdaChange = (e) => {
        setLambda(parseFloat(e.target.value))
    }

    const handleRadChange = (e) => {
        setRad(parseFloat(e.target.value))
    }

    const checkForms = () => {
        if (lambda === '') {
            alert('Введите длину волны')
            return false
        }
        if (n0 === '') {
            alert('Введите показатель преломления среды между линзой и пластиной')
            return false
        }
        if (n1 === '') {
            alert('Введите показатель преломления линзы')
            return false
        }
        if (n2 === '') {
            alert('Введите показатель преломления пластины')
            return false
        }
        if (r === '') {
            alert('Введите радиус линзы')
            return false
        }
        if (rad === '') {
            alert('Введите длину оси радиуса')
            return false
        }

        if (lambda <= 0) {
            alert('Длина волны должна быть > 0')
            return false
        }
        if (r <= 0) {
            alert('Радиус линзы должен быть > 0')
            return false
        }
        if (rad <= 0) {
            alert('Длина оси радиуса должны быть > 0')
            return false
        }
        if (n0 < 1) {
            alert('Показатель преломления среды между линзой и пластиной должен быть >= 1')
            return false
        }
        if (n1 < 1) {
            alert('Показатель преломления линзы должен быть >= 1')
            return false
        }
        if (n2 < 1) {
            alert('Показатель преломления пластины должен быть >= 1')
            return false
        }

        return true
    }

    const handlePlotUpdate = () => {
        if (!checkForms()) {
            return
        }

        const step = rad / 1000

        const newX = Array.from(
            {length: 1000},
            (_, index) => index * step
        )

        const rr = Math.pow((n2 - n0) / (n2 + n0), 2)
        const t = 4 * n0 * n1 / Math.pow(n1 + n0, 2)

        const newI = newX.map(rrr =>
            rr + Math.pow(t, 2) * rr + 2 * rr * t * Math.cos((2 * (Math.pow(rrr, 2) / 2 * r) * n0
                + (lambda * Math.pow(10, -9)) / 2) * 2 * Math.PI / (lambda * Math.pow(10, -9)))
        )

        setX(newX)
        setI(newI)
    }

    useEffect(() => {
        handlePlotUpdate()
    }, [])

    return (
        <div className={"container-fluid"}>
            <h1>Визуализация интерференционной картины колец Ньютона. Установка: плоская пластина и
                плоско-выпуклая линза. </h1>
            <Row>
                <Col xs={12} md={3}>
                    <Form>
                        <div style={{marginBottom: '10px', marginTop: '70px'}}>
                            <Form.Group controlId="lambda">
                                <Form.Label>Длина волны, λ (нм)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={lambda}
                                    onChange={handleLambdaChange}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="r">
                                <Form.Label>Радиус линзы, R (мм)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={r}
                                    onChange={handleRChange}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="n1">
                                <Form.Label>Показатель преломления линзы, n<sub>1</sub></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={n1}
                                    onChange={handleN1Change}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="n2">
                                <Form.Label>Показатель преломления пластины, n<sub>2</sub></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={n2}
                                    onChange={handleN2Change}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="n0">
                                <Form.Label>Показатель преломления среды между линзой и пластиной,
                                    n<sub>0</sub></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={n0}
                                    onChange={handleN0Change}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="rad">
                                <Form.Label>Радиус на графике (м)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={rad}
                                    onChange={handleRadChange}
                                />
                            </Form.Group>
                        </div>
                        <div>
                            <Button variant="primary" onClick={handlePlotUpdate}>Построить</Button>
                        </div>
                    </Form>
                </Col>
                <Col xs={12} md={9}>
                    <Plot
                        data={[
                            {
                                x: x,
                                y: i,
                                type: 'scatter',
                                mode: 'lines',
                                name: '',
                                line: { color: 'orange' }
                            }
                        ]}
                        layout={{
                            width: '1200',
                            height: '600',
                            xaxis: {title: 'Радиус, (м)'},
                            yaxis: {title: 'Интенсивность (Вт/м^2)'},
                        }}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default App