import { useState } from 'react'
import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'
import { Card, CardHeader, CardTitle, CardBody, Alert } from 'reactstrap'
import { AlertCircle } from 'react-feather'

const FileUploaderMulti = (props) => {
  const [previewArr, setPreviewArr] = useState([])
  const [error, setError] = useState([''])
  const [visible, setVisible] = useState('')

  const uppy = new Uppy({
    meta: { type: 'avatar' },
    autoProceed: true
  })

  uppy.use(thumbnailGenerator)

  uppy.on('thumbnail:generated', (file, preview) => {
    // if (previewArr.length < 2) {
      const arr = previewArr
      arr.push(preview)
      setPreviewArr([...arr])
      props.functionCallFromParent(preview)
    // } else {
    //   setError("you can only add two Images")
    //   setVisible(true)
    // }
  })


  const renderPreview = () => {
    if (previewArr.length) {
      return previewArr.map((src, index) => <img key={index} className='rounded mt-2 mr-1' src={src} alt='avatar' />)
    } else {
      return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'> Multiple Files Upload</CardTitle>
      </CardHeader>
      <CardBody>
        <DragDrop uppy={uppy} />
        {/* <Alert color='danger' isOpen={visible}>
        <div className='alert-body'>
          <AlertCircle size={15} />{' '}
          <span className='ml-1'>
            {error}
          </span>
        </div>
      </Alert> */}
        {renderPreview()}
      </CardBody>
    </Card>
  )
}

export default FileUploaderMulti
