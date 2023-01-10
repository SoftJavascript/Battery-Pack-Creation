import React, {useState, Fragment} from 'react';
import { NumericFormat } from 'react-number-format';
import { FcFactory, FcChargeBattery, FcFlashOn, FcCrystalOscillator, FcElectricity, FcFlashAuto, FcElectricalSensor } from "react-icons/fc";




function CreateBattery() {

  // const [volts, setVolts] = useState(12)
  // const [watts, setWatts] = useState(400)
  // const [amperes, setAmperes] = useState()
  

  const initialState = {
    volts: 36,
    watts: 400,
    amperes: 11.111,
    workingTime: 1,
  }

  const initialStateCellType = {
    volts: 3.6,
    capacity: 2600,
    dischargeI: 36,
    cells: 1,
    weight: 48,
  }

  const initialStatePack = {
    series: 1,
    parallels: 1,
    capacity: 1,
    weight: 1,
    cells: 1,
    volts: 1,
  }


  const [newData, setNewData] = useState(initialState)
  const [cellType, setCellType] = useState(initialStateCellType)
  const [packBattery , setPackBattery] = useState(initialStatePack)
  const [updateCalculation, setUpdateCalculation] = useState(true)
  const [updatePackCalc, setUpdatePackCalc] = useState(true)
  const [ParallelsNotRounded, setParallelsNotRounded] = useState(0)
  const [show,setShow]=useState(false)


  const typeCell = {
    cellsData:
    {
      14500: {
        brand: "Panasonic",
      },
      17500: {
      },
      18500: {
        NCR18650BE: {
          brand: "Panasonic",
          volts: "3.7",
          miniVolts: "3",
          maxVolts: "4.2",
          capacityMah: "3200",
          technology: "Li-ion",
          charge: "1.2",
          chargeMax: "2.2",
          discharge: "1.2",
          dischargeMax: "4.8",
          weight: "50",
        },
      },
      21700: {
        INR21700: {
          brand: "Samsung",
          volts: "3.7",
          miniVolts: "2.5",
          maxVolts: "4.2",
          capacityMah: "5000",
          technology: "Li-ion",
          charge: "2.4",
          chargeMax: "",
          discharge: "9.8A",
          dischargeMax: "14.7",
          weight: "69",
        },
      },
    }
  }


  
 
    if (updateCalculation) {
          
      if (newData.amperes === 0){
        let resultAmperes = newData.watts/newData.volts
          setNewData({...newData, amperes: resultAmperes.toFixed(3)})
          setUpdateCalculation(false)
          
        } else {
          let resultWatts = newData.volts*newData.amperes
          setNewData({...newData, watts: resultWatts.toFixed(2)})
          setUpdateCalculation(false)
        }
      }  

    if (updatePackCalc) {

      const seriesInPack = (newData.volts/cellType.volts);
      const roundedSeries = Math.ceil(seriesInPack)
      
      const parallelsPack = () => {
        if (cellType.capacity >= newData.amperes*1000) {
          return 0
        }
        return ((newData.amperes*newData.workingTime)/(cellType.capacity/1000)).toFixed(2)
      }
      setParallelsNotRounded(parallelsPack())
      const roundedParallels = Math.ceil(parallelsPack())
      
      const capacityPack = () => {
        if(parallelsPack() === 0){
          return (cellType.capacity/1000)
        }
        return (parallelsPack() * (cellType.capacity/1000))
      }
      
      const voltsPack = () => {
        return (cellType.volts * roundedSeries)
      }
      
      
      const cellsPack = () => {
        if (roundedParallels === 1){
          return (seriesInPack*2)
        } else if (roundedParallels === 0){
          return seriesInPack
        }
        return (roundedSeries * roundedParallels)
      }

      const weightPack = ((cellsPack() * cellType.weight)/1000)
      
      setPackBattery( {...packBattery, 
        series: seriesInPack,
        parallels: roundedParallels,
        volts: voltsPack(),
        capacity: capacityPack(), 
        cells: cellsPack(), 
        weight: weightPack,
      })
      setUpdatePackCalc(false)
    }  

    function DropdownCells() {


      const {
        cellsData: {
          18500: {
            NCR18650BE: {
              brand,
              volts,
              miniVolts,
              maxVolts,
              capacityMah,
              technology,
              charge,
              chargeMax,
              discharge,
              dischargeMax,
              weight,
            },
          },
        },
      } = typeCell

    //  console.log(typeCell.cellsData);


    //   const listTypeCell = typeCell.map((typeCell, index) =>
    //   <li href="/#" className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white" key={index}>{typeCell}</li>
    //   )


      return (
        <Fragment>
              <div className="flex w-full min-w-[280px]">
                  <div className="relative inline-block mt-9 mx-2 w-full">

                      {/* <!-- Dropdown toggle button --> */}
                      <button className="relative w-full z-10 flex items-center -mt-5 p-2 text-black bg-white border-2 border-white rounded focus:border-blue-500 focus:ring dark:text-white dark:bg-darkBlue" onClick={()=>show?setShow(false):setShow(true)}>
                            <span className="mx-1">Type Cell</span>
                            <svg className="w-6 h-6 mx-1 absolute right-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor"></path>
                            </svg>
                      </button>

                      {/* <!-- Dropdown menu --> */}
                      {show?
                      <div className=" absolute w-full right-0 z-20 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800">
                          <a href="/#" className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                              <div className="mx-1">
                                  <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">+Add Cell</h1>
                              </div>
                          </a>

                          <hr className="border-gray-200 dark:border-gray-700 "/>

                          {/* <div>{listTypeCell}</div> */}
                          
                      </div>
                      :null
                      }
                  </div>
              </div>
                  
        </Fragment>
      )
    }
    
  

    function BatteryPack() { 
      return  (
            <Fragment>
              <div className="grid justify-items-center mt-10 sm:mt-20 sm:ml-7">
                <span className='text-lg text-green-300 font-extrabold'><span className='text-2xl'>Pack Battery</span><br/>{packBattery.series}s{packBattery.parallels}p</span><br/><br/>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mx-auto">
                  <div>
                    <span className='text-lg text-green-300 font-extrabold'>{packBattery.series}</span>&emsp;<div className='inline-flex items-baseline>Cells'>Cells<span className='flex items-center'><FcChargeBattery/></span> Series</div>
                  </div>
                  <div>
                    <span className='text-lg text-green-300 font-extrabold'>{packBattery.volts} V</span><div className="inline-flex items-baseline my-auto">&emsp;Volts&emsp;<span className='flex items-center'><FcFlashOn /></span></div><br/>
                  </div>
                  <div>
                    <span className='text-lg text-green-300 font-extrabold'>{Math.round(packBattery.parallels)}</span>&emsp;<span className='flex items-center inline-flex'>Cells<FcChargeBattery/></span><span> Parallels</span>&emsp;<span className='text-lg text-green-300 font-extrabold'>&emsp;({ParallelsNotRounded})</span>
                  </div>
                  <div>
                    <span className='text-lg text-green-300 font-extrabold'>{packBattery.cells}</span><span>&emsp;Quantity Cells</span><br/>
                  </div>
                  <div>
                    <span className='text-lg text-green-300 font-extrabold'>{packBattery.capacity.toFixed(2)}</span><div className='inline-flex items-baseline'>&emsp;Capacity &emsp;<span className=' my-auto'><FcFlashAuto /></span></div><br/>
                  </div>
                  <div>
                    <span className='text-lg text-green-300 font-extrabold'>{packBattery.weight} Kg</span><span>&emsp;Weight</span><br/>
                  </div>
                </div>
              </div>
            </Fragment>
      )
    }     


  return (
    <>
      <div onClick={()=>show?setShow(false):null}>

        <h1 className="text-center p-14">Create New Battery</h1>

        <div className="container sm:grid gap-4 grid-rows-2 mx-auto sm:grid-cols-2 md:grid-cols-3">
          <div className='flex justify-center'>
            <div className='m-5 mx-auto w-96'>
              <div className='flex flex-col justify-center -space-y-2'>
                <h2 className='ml-3 inline-flex items-baseline my-auto'><FcFactory />&emsp;Needs</h2><br/>
                <label className='m-4 inline-flex items-baseline my-auto'>Volts&emsp;<span className='flex items-center'><FcFlashOn /></span></label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="text" 
                  placeholder='12' 
                  min="0.3" step="any"
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                  decimalSeparator="."
                  value={newData.volts}
                  onChange={e => {setNewData({...newData, volts: e.target.value*1, amperes: 0}); setUpdateCalculation(true); setUpdatePackCalc(true)}}
                /><br/>
                <label className='m-4 inline-flex items-baseline'>Watts&emsp;<span className='flex items-center my-auto'><FcElectricity/></span></label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="text" 
                  placeholder='400'
                  min="0.01"
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                  value={newData.watts}
                  onChange={e => {setNewData({...newData, watts: e.target.value*1, amperes: 0}); setUpdateCalculation(true); setUpdatePackCalc(true)}}
                /><br/>
                <label className='m-4'>Amperes</label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="text" 
                  placeholder='3'
                  min="0.001" 
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                  value={newData.amperes}
                  onChange={e => {setNewData({...newData, amperes: e.target.value*1, watts: 0}); setUpdateCalculation(true); setUpdatePackCalc(true)}}
                /><br/>
                <label className='m-4 inline-flex items-baseline'>Working Time in Hours&emsp;<span className='flex items-center my-auto'><FcElectricalSensor/></span></label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="number" 
                  placeholder='0.76'
                  min="0.01" 
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                  value={newData.workingTime}
                  onChange={e => {setNewData({...newData, workingTime: e.target.value*1, watts: 0}); setUpdateCalculation(true); setUpdatePackCalc(true)}}
                /><br/>
              </div>
            </div>
          </div>

          <div className='flex justify-center'>
            <div className='m-5 w-96 mt-10 sm:mt-0'>
              <div className='flex flex-col justify-center -space-y-2'>
                <h2 className='ml-3 mt-5 inline-flex items-baseline my-auto'><FcChargeBattery />&emsp;Cells for the Pack Battery</h2>
                <br/><br/>

                <DropdownCells />
            
              
            
                <br/>
                <label className='m-4 inline-flex items-baseline'>Volts&emsp;<span className='flex items-center my-auto'><FcFlashOn /></span></label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="text" 
                  placeholder='3.6'
                  min="0.01"
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                  value={cellType.volts}
                  onChange={
                    e => {setCellType({...cellType, volts: e.target.value*1}); 
                    setUpdatePackCalc(true)
                  }}
                /><br/>
                <label className='m-4 inline-flex items-baseline'>Capacity in mah &emsp;<span className='flex items-center my-auto'><FcCrystalOscillator/></span></label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="text" 
                  placeholder='2900'
                  min="0.001" 
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                  value={cellType.capacity}
                  onChange={
                    e => {setCellType({...cellType, capacity: e.target.value*1}); 
                    setUpdatePackCalc(true)
                  }}
                /><br/>
                <label className='m-4'>Discharge current In A</label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="number" 
                  placeholder='10'
                  min="0.01" 
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                /><br/>
                <label className='m-4'>Weight in g</label><br/>
                <NumericFormat 
                  className="border-white border-2 rounded p-2 m-2 bg-transparent" 
                  type="number" 
                  placeholder='44'
                  min="0.01" 
                  pattern="[0-9]+([\.][0-9]{1,2})?"
                  value={cellType.weight}
                  onChange={
                    e => {setCellType({...cellType, weight: e.target.value*1}); 
                    setUpdatePackCalc(true)
                  }}
                /><br/>
              </div>
              </div>
          </div>

          <div>
            <BatteryPack />
            
        


          </div>

        </div>
      </div>
    </>
  )
}

export default CreateBattery
