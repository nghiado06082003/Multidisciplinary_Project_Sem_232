import React from 'react'
import { useState } from "react"
import { Link, useParams } from 'react-router-dom'
import classnames from 'classnames'
import { useAddNewDeviceMutation, useDeleteDeviceMutation, useGetAllDevicesByRoomIdQuery, useGetRoomByIdQuery, useUpdateRoomByRoomIdMutation } from './roomService'
import './roomStyle.css'
export const RoomDeviceList = () => {
    const { garden_id, room_id } = useParams()
    const {
        data: room_info,
        isLoading: isLoad,
        isFetching: isFetch,
        isSuccess: isSucc,
        isError: isErr,
        error: err,
    } = useGetRoomByIdQuery(room_id)
    const {
        data: device_list,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetAllDevicesByRoomIdQuery(room_id)

    let room_content = null
    let device_content = null
    const [deleteDevice] = useDeleteDeviceMutation()
    const [addDevice] = useAddNewDeviceMutation()
    const [updateRoom] = useUpdateRoomByRoomIdMutation()

    const [deviceType, setDeviceType] = useState('temp-sensor')
    const [deviceName, setDeviceName] = useState('')
    const [isAutoFan, setIsAutoFan] = useState('1')
    const [threshold, setThreshold] = useState('')

    const onDeviceTypeChange = e => setDeviceType(e.target.value)
    const onDeviceNameChange = e => setDeviceName(e.target.value)
    const onIsAutoFanChange = e => setIsAutoFan(e.target.value)
    const onThresHoldChange = e => setThreshold(e.target.value)

    const canSaveDevice = [deviceType].every(Boolean) && !isLoading
    const canSaveRoom = [isAutoFan, threshold].every(Boolean) && !isLoad

    const onSaveDeviceClicked = async () => {
        if (canSaveDevice) {
            try {
                await addDevice({ garden_id: garden_id, room_id: room_id, type: deviceType, name: deviceName })
                setDeviceType('temp-sensor')
                setDeviceName('')
            }
            catch (err) {
                alert(err)
            }
        }
    }

    const onSaveRoom = async () => {
        if (true) {
            console.log(isAutoFan)
            try {
                await updateRoom({ room_id: room_id, isAutoFan: isAutoFan == 1, threshold: threshold })
                setIsAutoFan('1')
                setThreshold('')
            }
            catch (err) {
                alert(err)
            }
        }
    }

    if (isLoad) {
        room_content = (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải nội dung...</span>
            </div>
        )
    }
    else if (isSucc) {
        room_content = (
            <>
                <h6>Tên phòng: {room_info.data[0].name}</h6>
                <h6>Tự động bật quạt: {room_info.data[0].isAutoFan ? "Bật" : "Tắt"}</h6>
                <h6>Nhiệt độ thiết lập: {room_info.data[0].isAutoFan ? room_info.data[0].threshold : "--"}</h6> 
            </>
        )
    }
    else if (isErr) {
        room_content = <h6 class="text-danger">{err.toString()}</h6>
    }

    if (isLoading) {
        device_content = (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải nội dung...</span>
            </div>
        )
    }
    else if (isSuccess) {
        let pre_device_content = (
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
                                <Link to={`/gardens/${garden_id}/rooms/${room_id}/devices/${device._id}`} className='btn btn-primary'>Điều khiển thiết bị</Link>
                                <button className='btn btn-danger' onClick={async () => { await deleteDevice(device._id).unwrap() }}>Xoá thiết bị</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
        const containerClassname = classnames('devices-container', {
            disabled: isFetching
        })
        device_content = <div className={containerClassname}>{pre_device_content}</div>
    }
    else if (isError) {
        device_content = <h6 class="text-danger">{error.toString()}</h6>
    }

    return (
        <div className='container-md px-4'>
            <h2>Thông tin phòng </h2>
            <div className="border border-2 rounded-4 shadow pt-2 pb-2 px-5">
                    {room_content}
                <form>
                    <div className='d-flex mt-5 mb-3'>
                        <div className='col-auto mb-1 adjustAutoMode'>
                            <label for="roomMode"  className="form-label fw-semibold adjustAutoModeLabel">Áp dụng chế độ tự động</label>
                            <select
                                className='form-select pt-3 px-4 border-2 border-success adjustAutoModeInput'
                                id='roomMode'
                                name='roomMode'
                                value={isAutoFan}
                                onChange={onIsAutoFanChange}
                            >
                                <option value="1">Bật</option>
                                <option value="-1">Tắt</option>
                            </select>
                        </div>
                        <div className='col-auto mb-1 adjustAutoMode'>
                            <label for="roomThreshold" className="form-label fw-semibold adjustAutoModeLabel">Giá trị nhiệt thiết lập</label>
                            <input
                                type="number"
                                className='form-control pt-3 px-4 border-2 border-success adjustAutoModeInput'
                                id="roomThreshold"
                                name="roomThreshold"
                                step="0.01"
                                value={threshold}
                                onChange={onThresHoldChange}
                            />
                        </div>
                        <div className='adjustAutoModeButton'>
                            <button className='btn btn-success' onClick={onSaveRoom}>Chỉnh sửa chế độ phòng</button>
                        </div>
                    </div>
                </form>
                
            </div>
            <h2>Danh sách thiết bị </h2>
            <div className='row align-items-center'>
                <form>
                    <div className='col-auto'>
                        <label for="deviceType" className="form-label">Loại thiết bị muốn thêm:</label>
                        <select
                            className='form-select'
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
                    <div className='col-auto'>
                        <label for="deviceName" className="form-label">Tên thiết bị mới</label>
                        <input
                            type="text"
                            className='form-control'
                            id="deviceName"
                            name="deviceName"
                            value={deviceName}
                            onChange={onDeviceNameChange}
                        />
                    </div>
                </form>
                <div className='col-auto'>
                    <button className='btn btn-primary' onClick={onSaveDeviceClicked}>Thêm thiết bị mới</button>
                </div>
            </div>
            <div className='row justify-content-end'>
                <div className='col-auto'>
                    <button className='btn btn-primary mx-2' onClick={refetch}>Làm mới danh sách thiết bị</button>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col'>
                    {device_content}
                </div>
            </div>
        </div>
    )
}