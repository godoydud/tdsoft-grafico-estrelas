import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

/**
 * Componente que representa o gráfico de estrelas.
 * Descrição completa está no README.md.
 *
 * PS: O código abaixo é apenas um esqueleto para vocês implementarem.
 *     Vocês podem (e devem) alterar tudo que quiserem, menos a interface
 *     Além disso, usem dos componentes que forem necessários, para isso importem o pacote junto aos "imports".
 */

const agruparPorData = (estrelas, agrupamento) => {
  let agrupamentoPorData = estrelas.reduce((acc, estrela) => {
    const data = new Date(estrela.starred_at);

    // Formatar data por agrupamento (dia, semana, mes, ano)
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

    // Verificar se a data já existe no objeto
    if (acc[data]) {
      acc[data] += 1;
    } else {
      acc[data] = 1;
    }
    return acc;
  }, {});

  // Ordenar por data
  agrupamentoPorData = Object.entries(agrupamentoPorData).sort((a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  });
  const data = [];
  agrupamentoPorData.forEach((item) => {
    data.push({ name: item[0], uv: item[1], pv: item[1], amt: item[1] });
  });

  return data;
};

const RenderLineChart = (data) => (
  <LineChart width={730} height={250} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
  </LineChart>
);

export function GraficoEstrelas(props) {
  const agrupamentoPorData = agruparPorData(props.estrelas, props.agrupamento);

  console.log(agrupamentoPorData);
  return <div><RenderLineChart data={agrupamentoPorData}/></div>;
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
