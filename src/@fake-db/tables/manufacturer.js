import mock from '../mock'
import { paginateArray } from '../utils'
import one from "../../assets/images/elements/apple-watch.png"

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'
import axios from 'axios'

const config = useJwt.jwtConfig


const auth = {
  headers : {
    Authorization : `${config.tokenType} ${config.storageTokenKeyName}`
  }
}

let data = []

axios.get('https://amanacart.com/api/admin/catalog/manufacturer', auth).then(response => {
  data = response.data
  // console.log(data)
}).catch(error => {
        // console.error(error)
      })

mock.onGet('/api/manufacturer/initial-data').reply(config => {
  return [200, data]
})

mock.onGet('/api/manufacturer/data').reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = data.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.full_name.toLowerCase().includes(queryLowered) ||
      item.post.toLowerCase().includes(queryLowered) ||
      item.email.toLowerCase().includes(queryLowered) ||
      item.age.toLowerCase().includes(queryLowered) ||
      item.salary.toLowerCase().includes(queryLowered) ||
      item.start_date.toLowerCase().includes(queryLowered)
  )
  /* eslint-enable  */

  return [
    200,
    {
      allData: data,
      invoices: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})
