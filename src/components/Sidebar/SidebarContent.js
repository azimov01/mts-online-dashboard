import React, {useState} from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import SidebarSubmenu from './SidebarSubmenu'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from '@windmill/react-ui'
import {OutlineLogoutIcon} from "../../icons";
import history from "../../history";

import tezpayLogo from "../../assets/img/tezpay.png";
import globizLogo from "../../assets/img/globiz.svg";
import uniredLogo from "../../assets/img/unired.svg"
import milliypayLogo from "../../assets/img/milliypay.jpg"

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function SidebarContent() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    let tezpay = "Bearer e38d6a4b-a276-4e54-8cd6-25bc507b20f3"
    let globiz = "Bearer a9461af0-de05-4788-acb0-e7867bdb2f18"
    let milliypay = "Bearer 2e5a6430-d7b0-4e83-9fdc-055cbbf4283d"
    let unired = "Bearer 440a24db-4178-4f83-bbed-2e99b1d0c0f7"
    let admin = "Bearer ef6d056e-e70f-4910-9b78-c6fff87f1039"

    const getToken = `Bearer ${localStorage.getItem("Bearer")}`

    function openModal() {
        setIsModalOpen(true)
    }
    function closeModal() {
        setIsModalOpen(false)
    }
    const logout = () => {
        localStorage.removeItem('Bearer')
        history.push('/')
        window.location.reload()
    }
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
        {getToken === tezpay ?
            <div>
                <img className="align-middle m-10" src={tezpayLogo} alt=""/>
            </div> :
            getToken === globiz ?
                <div>
                    <img className="align-middle m-10 pr-24" src={globizLogo} alt=""/>
                </div> :
                getToken === milliypay ?
                    <div>
                        <h1 className="dark:text-white font-bold m-10">Milliy Pay</h1>
                        {/*<img className="align-middle w-10 m-10" src={milliypayLogo} alt=""/>*/}
                    </div> :
                    getToken === unired ?
                        <div>
                            <img className="align-middle m-10" src={uniredLogo} alt=""/>
                        </div> :
                        <div>

                        </div>
        }

      <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
          Admin Dashboard
      </a>
      <ul className="mt-6">
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      <div className="px-6 my-6">
        <Button onClick={openModal}>
            <span className="ml-2" aria-hidden="true">
            <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true"/>
          </span>
            Log Out
        </Button>
      </div>



        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalHeader>Are you sure log out?</ModalHeader>
            <ModalBody>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum et eligendi repudiandae
                voluptatem tempore!
            </ModalBody>
            <ModalFooter>
                {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
                <div className="hidden sm:block">
                    <Button layout="outline" onClick={closeModal}>
                        Cancel
                    </Button>
                </div>
                <div className="hidden sm:block">
                    <Button onClick={logout}>Yes, I'm sure</Button>
                </div>
                <div className="block w-full sm:hidden">
                    <Button block size="large" layout="outline" onClick={closeModal}>
                        Cancel
                    </Button>
                </div>
                <div className="block w-full sm:hidden">
                    <Button block size="large" onClick={logout}>
                        Yes, I'm sure
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    </div>
  )
}

export default SidebarContent
