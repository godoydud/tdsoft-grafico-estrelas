import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const agruparPorData = (estrelas, agrupamento) => {
  let agrupamentoPorData = estrelas.reduce((acc, estrela) => {
    const data = new Date(estrela.starred_at);

    if (agrupamento === 'dia') {
      data.setHours(0, 0, 0, 0);
    } else if (agrupamento === 'semana') {
      data.setDate(data.getDate() - data.getDay());
      data.setHours(0, 0, 0, 0);
    } else if (agrupamento === 'mes') {
      data.setDate(1);
      data.setHours(0, 0, 0, 0);
    } else if (agrupamento === 'ano') {
      data.setMonth(0, 1);
      data.setHours(0, 0, 0, 0);
    }

    if (acc[data]) {
      acc[data] += 1;
    } else {
      acc[data] = 1;
    }
    return acc;
  }, {});

  agrupamentoPorData = Object.entries(agrupamentoPorData).sort((a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  });

  return agrupamentoPorData.map((data) => {
    return { date: data[0], estrelas: data[1] };
  });
};

const aplicarEscalaLog = (data, escala) => {
  if (escala === 'log') {
    data.forEach((item) => {
      item.estrelas = Math.log(item.estrelas);
    });
  }

  data.forEach((item) => {
    const data = new Date(item.date);
    item.date = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
  });
  
  return data;
}

const RenderLineChart = (props) => {
  return (
    <LineChart
      width={730}
      height={250}
      data={props.data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis scale={props.escala} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="estrelas" stroke="#8884d8" />
    </LineChart>
  );
};

export function GraficoEstrelas(props) {
  const agrupamentoPorData = agruparPorData(props.estrelas, props.agrupamento);
  const dadosComEscala = aplicarEscalaLog(agrupamentoPorData, props.escala);
  console.log(dadosComEscala);
  return <div><RenderLineChart data={dadosComEscala} /></div>;
}

// Definição dos tipos das propriedades recebidas.
GraficoEstrelas.propTypes = {
  estrelas: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      starred_at: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
  agrupamento: PropTypes.oneOf(['dia', 'semana', 'mes', 'ano']),
  escala: PropTypes.oneOf(['linear', 'log']),
};

// Definição dos valores padrão das propriedades.
GraficoEstrelas.defaultProps = {
  agrupamento: 'dia',
  escala: 'linear',
};
