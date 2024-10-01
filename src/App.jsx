import { useState, useEffect } from 'react'

function App() {
  const [answers, setAnswers] = useState(["a","b","c","d"])
  const [textAnswers, setTextAnswers] = useState([])
  const [numPregunta,setNumPregunta] = useState(0)
  const [preguntaActual, setPreguntaActual] = useState("");
  const [color, setColor] = useState("")
  const [correcto,setCorrecto] = useState(null)
  const [puntos, setPuntos] = useState(0)
  const [vidas, setVidas] = useState(3)

  const plantilla = [
    {backgroundColor: '#CC9933'},
    {backgroundColor: '#CC9933'},
    {backgroundColor: '#CC9933'},
    {backgroundColor: '#CC9933'}
  ]

  const [estilos, setEstilos] = useState(plantilla)

  function randnum (lim){
   return Math.floor(Math.random()*lim)
  }

  function check (elem,index) {
    let nuevosEstilos = [...estilos]
    nuevosEstilos[index] = {backgroundColor: '#3366FF'}
    setEstilos(nuevosEstilos)
    
    setTimeout(()=>{
      if(elem.innerText == correcto)
      {
        nuevosEstilos = [...estilos]
        nuevosEstilos[index] = {backgroundColor: '#33CC00'}
        setEstilos(nuevosEstilos)
        setTimeout(()=>{
          setEstilos(plantilla)
          setPuntos(puntos+1)
        },1500)
        
      }
      else{
        
        let number = 0;
        textAnswers.map((el,ind)=>{
          if(el == correcto) number = ind;
        })
        nuevosEstilos = [...estilos]
        nuevosEstilos[index] = {backgroundColor: '#FF0000'}
        nuevosEstilos[number] = {backgroundColor: '#33CC00'}
        setEstilos(nuevosEstilos)
        setTimeout(()=>{
          setEstilos(plantilla)
          setVidas(vidas-1)
        },1500)
      }
    },1000)
    
  }

  useEffect(()=>{
    fetch("/data.json")
    .then(res => res.json())
    .then(data => {
      let num = randnum(6)
      setCorrecto(data.answers[num]);
      setPreguntaActual(data.questions[num])
      let nuevo = [];
      nuevo.push(num)
      while (nuevo.length < 4){
        num = randnum(6)
        if(!nuevo.includes(num)){
          nuevo = [...nuevo,num]
        }
      }
      let arreglo = nuevo.sort(()=> Math.random() - 0.5)
      let res = []
      arreglo.map((elemento)=>{
        res.push(data.answers[elemento])
      })

      setAnswers(arreglo)
      setTextAnswers(res)
      
    })
  },[puntos,vidas])
  
  return (
    <div className='game'>
      <header>
        <div className='left'>
          <div>Puntos</div>
          <div className='points'>{puntos}</div>
        </div>

        <div className='right'>
          <div>Vidas</div>
          <div>
            {
              vidas
            }
          </div>
        </div>
      </header>
      <main>
        <div className='question'>{preguntaActual}</div>
        <div className='buttons'>
          {
            textAnswers.map((elemento,index)=>{
            return <button className='answer' key={index} style = {estilos[index]} onClick={(e)=>{check(e.target,index)}} >{elemento}</button>
            })
          }
        </div>
      </main>
    </div>
  )
}

export default App
