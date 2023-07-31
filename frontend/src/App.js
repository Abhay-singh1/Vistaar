import './App.scss';
import axios from 'axios'
import {useState, useEffect} from 'react'
import { AiOutlineClose} from 'react-icons/ai'

function App() {

  const[data, setdata]=useState([])
  const[transaction, setTransaction] = useState([])
  const[products, setProducts] = useState([])
  const[accounts, setAccounts] = useState([])
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [showAccountsModal, setShowAccountsModal] = useState(false)
  const [id, setId] = useState()



  //Get customer lists
  const fetchData =async()=>{
    let response = await axios.get(`http://localhost:5000/customers`)
    setdata(response.data)
  }

  //fetch transactions of accounts
  const fetchTransactions = async(id)=>{
    setId(id)
    let response = await axios.get(`http://localhost:5000/transactions/${id}`)
    setTransaction(response.data)
    setShowTransactionModal(true)
  }


  //Fetch accounts with transactions less than 5000
  const fetchAccounts = async()=>{
    let response = await axios.get(`http://localhost:5000/accounts`)
    setAccounts(response.data)
    setShowAccountsModal(true)
  }


  //Fetch Distinct Products 

  const fetchProducts = async()=>{
    let response = await axios.get(`http://localhost:5000/products`)
    console.log(response.data)
    setProducts(response.data)
    setShowProductsModal(true)
  }


  useEffect(()=>{
    fetchData()
    // console.log(sortTasks)
  },[])

  return (

    <div>
    <div className="App">


      <div className='fetchdiv'>
      <div className='header'>
        <h1>List of active Customers</h1>
        <div style={{display:'flex', flexDirection:'column', rowGap:'10px'}}>
          <button onClick={()=>fetchAccounts()} >Accounts with transaction below 5000</button>
          <button onClick={()=>fetchProducts()}>Distinct list of available product</button>
        </div>
      </div>

     

      <table>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Accounts</th>
        </tr>
        <tbody>
          {
            data && data.map((item,key)=>{
             
              return(
                <tr key={key}>
                  <td  >{item.name}</td>
                  <td >{item.address}</td>
                  {
                    item.accounts.map((i,k)=>{
                      return(
                        <tr>
                          <td style={{cursor:'pointer'}} onClick={()=>fetchTransactions(i)} key={k}>{i}</td>
                        </tr>

                      )
                    })
                  }
                </tr>
              )
            })
          }
          
        </tbody>
        
        
      </table>

     </div>

    </div>
      {
        showTransactionModal && 
        (<div className='modal'>
          <div className='overlay'>
            <div className='modal-content'>
              <AiOutlineClose className='closeicon'   onClick={()=>setShowTransactionModal(false)} />
              <h3>List of Transactions</h3>
              <div className='accounts'>
                <table>
                  <tr>
                    <th>Date</th>
                    <th>Symbol</th>
                    <th>Total</th>
                  </tr>
                  <tbody>
                    {
                      
                        transaction[0].transactions?.map((item, key)=>{
                          let date = new Date(item.date).toLocaleDateString()
                          return(
                            <tr key={key}>
                            <td>{date}</td>
                            <td>{item.symbol}</td>
                            <td>{item.total}</td>
                            
                            </tr>
                          )
                        })
                    }
                    
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>)
      }
      
      
      {
        showAccountsModal && 
        (<div className='modal'>
          <div className='overlay'>
            <div className='modal-content'>
              <AiOutlineClose className='closeicon'   onClick={()=>setShowAccountsModal(false)} />

              <h3>Accounts having less than 5000 transaction</h3>
              <div className='accounts'>
                <table>
                  <tr>
                    <th>Accounts ID</th>
                  </tr>
                  <tbody>
                    {
                      accounts?.map((item, key)=>{
                        return(
                          <tr key={key}>
                            <td>{item._id}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>)
      }


      {
        showProductsModal && 
        (<div className='modal'>
          <div className='overlay'>
            <div className='modal-content'>
              <AiOutlineClose className='closeicon'   onClick={()=>setShowProductsModal(false)} />

              <h3>Distinct Products List</h3>
              <div className='accounts'>
                <table>
                  <tr>
                    <th>Products</th>
                  </tr>
                  <tbody>
                    {
                      products?.map((item, key)=>{
                        return(
                          <tr key={key}>
                            <td>{item}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>)
      }

    </div>
  );
}

export default App;
