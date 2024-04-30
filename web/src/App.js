import { Route, Routes } from 'react-router-dom';
import { NavBar } from './template/navbar';
import { Homepage } from './template/homepage';
import { GardensList } from './components/garden/gardensList';
import { GardenRoomList } from './components/garden/gardenRoomList';
import { RoomDeviceList } from './components/room/roomDeviceList';
import { DeviceControl } from './components/device/deviceControl';
import { LogIn } from './components/login/logIn';

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Homepage />} />
        <Route path='login' element={<LogIn />} />
        <Route path='gardens'>
          <Route index element={<GardensList />} />
          <Route path=':garden_id/rooms'>
            <Route index element={<GardenRoomList />} />
            <Route path=':room_id/devices'>
              <Route index element={<RoomDeviceList />} />
              <Route path=':device_id' element={<DeviceControl />} />
            </Route>
          </Route>
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
