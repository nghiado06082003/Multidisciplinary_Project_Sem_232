import React from 'react'
import { useState } from "react"
import { Link, useParams } from 'react-router-dom'
import classnames from 'classnames'
import { useAddNewDeviceMutation, useDeleteDeviceMutation, useGetAllDevicesByRoomIdQuery } from '../../api/apiSlice'

export const RoomDeviceList = () => {
    const { garden_id, room_id } = useParams()
    const {
        data: device_list,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetAllDevicesByRoomIdQuery(room_id)

    let content = null
    const [deleteDevice] = useDeleteDeviceMutation()
    const [addDevice] = useAddNewDeviceMutation()

    const [deviceType, setDeviceType] = useState('')

    const onDeviceTypeChange = e => setDeviceType(e.target.value)

    const canSave = [deviceType].every(Boolean) && !isLoading

    const onSaveClicked = async () => {
        if (canSave) {
            try {
                await addDevice({ garden_id: garden_id, room_id: room_id, type: deviceType })
                setDeviceType('')
            }
            catch (err) {
                alert(err)
            }
        }
    }

    if (isLoading) {
        content = (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải nội dung...</span>
            </div>
        )
    }
    else if (isSuccess) {
        let pre_content = (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Mã thiết bị</th>
                        <th scope='col'>Loại thiết bị</th>
                        <th scope="col">Tên thiết bị</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {device_list.data.map(device => (
                        <tr>
                            <th>{device._id}</th>
                            <td>{device.type}</td>
                            <td>{device.name}</td>
                            <td>
                                <Link to={`/gardens/${garden_id}/rooms/${room_id}/devices/${device._id}`} className='btn btn-success me-2'>Điều khiển thiết bị</Link>
                                <button className='btn btn-secondary' onClick={async () => { await deleteDevice(device._id).unwrap() }}>Xoá thiết bị</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
        const containerClassname = classnames('devices-container', {
            disabled: isFetching
        })
        content = <div className={containerClassname}>{pre_content}</div>
    }
    else if (isError) {
        content = <h6 class="text-danger">{error.toString()}</h6>
    }

    return (
        <div className='container-md px-4'>
            <h2>Danh sách thiết bị</h2>
            <div className="border border-2 rounded-4 shadow pt-2 pb-2 px-5">
                <h3 className='m-0 text-success'>Thêm thiết bị mới</h3>
                <div className='d-flex'>
                    <div className="col-auto mb-1 addGarden">
                        <div>
                            <label for="deviceType" className="form-label fw-semibold addGardenLabel">Loại thiết bị muốn thêm:</label>
                            <select
                                className='form-select pt-3 px-4 border-2 border-success addGardenInput'
                                id='deviceType'
                                name='deviceType'
                                value={deviceType}
                                onChange={onDeviceTypeChange}
                            >
                                <option value="temp-sensor">Cảm biến nhiệt độ</option>
                                <option value="humid-sensor">Cảm biến độ ẩm</option>
                                <option value="light-sensor">Cảm biến ánh sáng</option>
                                <option value="movement-sensor">Cảm biến chuyển động</option>
                                <option value="led">Đèn LED</option>
                                <option value="fan">Quạt</option>
                                <option value="sprinkler">Máy tưới nước</option>
                            </select>
                        </div>
                    </div>
                    <div className="addGardenButton">
                        <button className='btn btn-success' onClick={onSaveClicked}>Thêm thiết bị</button>
                    </div>
                </div>
            </div>
            
            <div className='justify-content-center border border-2 rounded-4 shadow px-5 mt-3 pt-3 gardenList'>
                <div className='d-flex justify-content-between mb-2'>
                    <h3 className='m-0 text-success'>Thiết bị hiện có</h3>
                    <div className='col-auto'>
                        <button className='btn btn-success' onClick={refetch}>Làm mới</button>
                    </div>
                </div>
                <div className='col'>
                    {content}
                </div>
            </div>
        </div>
    )
}