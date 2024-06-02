import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import classnames from 'classnames'
import { useGetDeviceByIdWithLogQuery, useUpdateDeviceDataMutation } from './deviceService'

export const DeviceControl = () => {
    const { garden_id, room_id, device_id } = useParams()
    const {
        data: device_info,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetDeviceByIdWithLogQuery(device_id)

    let content = null
    let formType = null
    let currentData = null

    const [updateDevice] = useUpdateDeviceDataMutation()

    const [updateData, setUpdateData] = useState(0)

    const onUpdateDataChange = e => setUpdateData(e.target.value)

    const canSave = !isLoading

    const sensorList = ["temp-sensor", "humid-sensor", "light-sensor", "movement-sensor"]

    const onSaveClicked = async () => {
        if (canSave) {
            try {
                await updateDevice({ device_id: device_id, data: updateData })
                setUpdateData(0)
            }
            catch (err) {
                alert(err)
            }
        }
    }

    if (isLoading) {
        content = (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải lịch sử...</span>
            </div>
        )
    }
    else if (isSuccess) {
        let log_list = {}
        let log_list_key = []
        if (sensorList.includes(device_info.data[0].type)) {
            currentData = device_info.data[0].curr_value
            log_list = device_info.data[0].values
            log_list_key = Object.keys(log_list)
            console.log(log_list_key)
            formType = (
                <div className='row align-items-center'>
                    <div className='col-auto'>
                        <form>
                            <label for="updateData" className="form-label">Giá trị muốn thay đổi</label>
                            <input
                                type="text"
                                className='form-control'
                                id="updateData"
                                name="updateData"
                                value={updateData}
                                onChange={onUpdateDataChange}
                            />
                        </form>
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={onSaveClicked}>Thay đổi giá trị</button>
                    </div>
                </div>
            )
        }
        else {
            currentData = device_info.data[0].curr_state
            log_list = device_info.data[0].state_time
            log_list_key = Object.keys(log_list)
            console.log(log_list_key)
            formType = (
                <div className='row align-items-center'>
                    <div className='col-auto'>
                        <form>
                            <label for="updateData" className="form-label">Trạng thái muốn thay đổi:</label>
                            <select
                                className='form-select'
                                id='updateData'
                                name='updateData'
                                value={updateData}
                                onChange={onUpdateDataChange}
                            >
                                <option value="0">Tắt</option>
                                <option value="1">Bật</option>
                            </select>
                        </form>
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={onSaveClicked}>Thay đổi trạng thái</button>
                    </div>
                </div>
            )
        }
        let pre_content = (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Thời điểm cập nhật</th>
                        <th scope='col'>Giá trị cập nhật</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        log_list_key.map(k => (
                            <tr>
                                <th>{k}</th>
                                <td>{log_list[k]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        )
        const containerClassname = classnames('devices-container', {
            disabled: isFetching
        })
        content = (<div className={containerClassname}>{pre_content}</div>)
    }
    else if (isError) {
        content = (<h6 class="text-danger">{error.toString()}</h6>)
    }

    return (
        <div className='container-md'>
            <h2>Chi tiết thiết bị </h2>
            <div className='row'>
                <div className='col'>
                    <h5>Trạng thái hiện tại: {currentData}</h5>
                </div>
            </div>
            {formType}
            <div className='row justify-content-end'>
                <div className='col-auto'>
                    <button className='btn btn-primary' onClick={refetch}>Làm mới lịch sử</button>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col'>
                    {content}
                </div>
            </div>
        </div>
    )
}