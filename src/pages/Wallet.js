/* eslint-disable eqeqeq */
/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react'
import Main from '../layout/Main'
import {
  Card,
  Col,
  Container,
  Nav,
  NavItem,
  ProgressBar,
  Row
} from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import fetcher from '../scripts/SharedFetcher'
import WithdrawTab from '../components/tabs/wallet/WithdrawTab'
import DepositTab from '../components/tabs/wallet/DepositTab'
import FundingTab from '../components/tabs/wallet/FundingTab'
import {
  PROFIT_WALLET_BALANCE,
  SALES_WALLET_BALANCE,
  USER_PLAN,
  WALLET_BALANCE
} from '../scripts/config/RestEndpoints'
import SharedConfig from '../scripts/SharedConfig'
import { UID } from '../scripts/config/contants'
import { toast } from 'react-toastify'
import { FaDollarSign } from 'react-icons/fa'
import accounting from 'accounting'

function Wallet (props) {
  const location = useLocation()
  const tab = new URLSearchParams(location.search)?.get('tab')

  const [fundingWallet, setFundingWallet] = useState('')
  const [profitWallet, setProfitWallet] = useState('')
  const [salesWallet, setSalesWallet] = useState('')
  const [energy, setEnergy] = useState(0)
  const [energyMax, setEnergyMax] = useState(0)

  useEffect(() => {
    const getPlan = async () => {
      let data = null
      try {
        data = await fetcher.fetch(USER_PLAN)
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message)
      } else {
        const det = data?.data?.plan
        setEnergy(det?.uid?.energy || 0)
        setEnergyMax(det?.packageId?.energyRefillingInDays || 0)
      }
    }
    getPlan()
  }, [])

  useEffect(() => {
    const uid = SharedConfig.getLocalData(UID)
    fetcher
      .fetch(WALLET_BALANCE + uid)
      .then((data) => setFundingWallet(data?.data?.balance || 0))
    fetcher
      .fetch(PROFIT_WALLET_BALANCE + uid)
      .then((data) => setProfitWallet(data?.data?.balance || 0))
    fetcher
      .fetch(SALES_WALLET_BALANCE + uid)
      .then((data) => setSalesWallet(data?.data?.balance || 0))
  }, [])

  return (
    <>
      <Main {...props}>
        <Container fluid>
          <Row>
            <Col xs="12" sm="12" md="12" lg="3">
              <Card>
                <Card.Header className="text-center">
                  <h3>Wallets</h3>
                </Card.Header>
                <Card.Header className="mt-0 pt-0 text-wrap overflow fw-bold">
                  Spot:
                  <br />
                  <span className="fw-bold fa fa-xl h2 text-primary ">
                    <FaDollarSign className="text-black"></FaDollarSign>
                    {accounting.formatMoney(fundingWallet, '', 2)}
                  </span>
                </Card.Header>
                <Card.Header className="mt-0 pt-0 text-wrap overflow fw-bold">
                  Profit:
                  <br />
                  <span className="fw-bold fa fa-xl h2 text-primary">
                    <FaDollarSign className="text-black"></FaDollarSign>
                    {accounting.formatMoney(profitWallet, '', 2)}
                  </span>
                </Card.Header>
                <Card.Header className="mt-0 pt-0 text-wrap overflow fw-bold">
                  Sales:
                  <br />
                  <span className="fw-bold fa fa-xl h2 text-primary">
                    <FaDollarSign className="text-black"></FaDollarSign>
                    {accounting.formatMoney(salesWallet, '', 2)}
                  </span>
                </Card.Header>
                <Card.Header className="mt-0 pt-0">
                  Energy:
                  <br />
                  <ProgressBar
                    min={0}
                    now={energy}
                    max={energyMax}
                    striped
                    animated
                  />
                  <div className="fa-xs text-center text-warning mt-2">
                    {energy !== 0 && energy === energyMax
                      ? 'Full energy'
                      : energyMax -
                        energy +
                        ' day' +
                        (energyMax - energy > 1 ? 's' : '') +
                        ' remaining'}
                  </div>
                </Card.Header>
                <Card.Footer className="mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link
                        to="../wallet?tab=deposit"
                        className={`nav-link ${
                          !tab || tab === 'deposit' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-download me-1"></i> Deposit
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../wallet?tab=withdraw"
                        className={`nav-link ${
                          tab === 'withdraw' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-upload me-1"></i> Withdraw
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../wallet?tab=transfer"
                        className={`nav-link ${
                          tab === 'transfer' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-exchange me-1"></i> Transfer
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="12" lg="9">
              {fundingWallet !== '' && tab == 'withdraw'
                ? (
                <WithdrawTab
                  {...props}
                  fundingWallet={fundingWallet}
                  profitWallet={profitWallet}
                  salesWallet={salesWallet}
                />
                  )
                : profitWallet !== '' && tab == 'transfer'
                  ? (
                <FundingTab
                  {...props}
                  fundingWallet={fundingWallet}
                  profitWallet={profitWallet}
                  salesWallet={salesWallet}
                />
                    )
                  : (
                <DepositTab {...props} />
                    )}
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Wallet
