/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Card, CardImg, Button } from 'react-bootstrap'
import Main from '../layout/Main'
import Utility from '../components/tabs/home/home_components/Utility'
import Gain from '../components/tabs/home/home_components/Gain'
import ExchangerGain from '../components/tabs/home/home_components/ExchangerGain'
import TradeView from '../components/tabs/trade/trade_tab_components/TradeView'
import fetcher from '../scripts/SharedFetcher'
import ClickCopy from '../components/general/ClickCopy'
import {
  TOP_EXCHANGER,
  TOP_GAINER,
  USER_DETAIL
} from '../scripts/config/RestEndpoints'
import SharedConfig from '../scripts/SharedConfig'
import { UID } from '../scripts/config/contants'
import { toast } from 'react-toastify'

function Dashboard (props) {
  // const [avatar, setFilename] = useGetDataUri();
  const [details, setDetails] = useState({})

  const [topExchanger, setTopExchanger] = useState('')
  const [topGainer, setTopGainer] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      let data = null
      try {
        data = await fetcher.fetch(USER_DETAIL)
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message)
      } else {
        setDetails(data?.data?.user)
        // data?.data?.user?.avatar && setFilename(data?.data?.user?.avatar);
      }
    }
    getProfile()
    fetcher
      .fetch(TOP_EXCHANGER)
      .then((data) => {
        setTopExchanger(data?.data?.topExchanger)
      })
      .catch(() => {})

    fetcher
      .fetch(TOP_GAINER)
      .then((data) => {
        setTopGainer(data?.data?.topGainer)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <Main {...props}>
        <Container>
          <Row>
            <Col sm={{ span: '12', order: '0' }} className="mb-4">
              <Card
                style={{
                  /* margin: '0 -30px', */ borderRadius: 0,
                  background: '#ff111111'
                }}
              >
                <Row className="d-flex align-items-center my-5">
                  <Col sm="7">
                    <Card.Body>
                      <Card.Title>
                        <h5 className="text-primary">
                          Welcome {details?.firstname}!
                        </h5>
                      </Card.Title>
                      <p className="mb-4">
                        Earn up to <span className="fw-bold">50%</span> in sales and trading profit of every person you refer to FATA
                      </p>

                      <button className="btn btn-sm btn-outline-primary">
                        <ClickCopy
                          title={'Copy Referral Link'}
                          text={
                            window.location.origin +
                            '/signup?ref=' +
                            SharedConfig.getLocalData(UID)
                          }
                        />
                      </button>
                      <Button size="sm" variant="primary" className="mx-2">
                        <a
                          className="text-white fw-bold"
                          href={'/how-fata-works.pdf'
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          How it works
                        </a>
                      </Button>
                    </Card.Body>
                  </Col>
                  <Col sm="5" className="text-center text-sm-left">
                    <Card.Body className="pb-0 px-0 px-md-4">
                      <CardImg
                        src={
                          '../assets/img/illustrations/man-with-laptop-light.png'
                        }
                        height="140"
                        alt="View Badge User"
                      />
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="4" sm="2" md="2" lg="2" className="mb-4">
              <Utility
                icon="fas fa-download"
                title="Deposit"
                link="/wallet?tab=deposit"
              />
            </Col>
            <Col xs="4" sm="2" md="2" lg="2" className="mb-4">
              <Utility
                icon="fas fa-user-friends"
                title="Refer"
                link="/referral"
              />
            </Col>
            <Col xs="4" sm="2" md="2" lg="2" className="mb-4">
              <Utility
                icon="fas fa-robot"
                title="Auto Trade"
                link="/auto-trade"
              />
            </Col>
            <Col xs="4" sm="2" md="2" lg="2" className="mb-4">
              <Utility
                icon="fas fa-trophy"
                title="Reward"
                link="/reward"
                comingSoon
              />
            </Col>
            <Col xs="4" sm="2" md="2" lg="2" className="mb-4">
              <Utility
                icon="fas fa-book-open"
                title="Academy"
                link="/academy"
                comingSoon
              />
            </Col>
            <Col xs="4" sm="2" md="2" lg="2" className="mb-4">
              <Utility
                icon="fas fa-landmark"
                title="Loan"
                link="/loan"
                comingSoon
              />
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Card className="" style={{ borderRadius: '0 100px 0 0' }}>
                <h3 className="bold text-black m0p10">Gains</h3>
              </Card>
            </Col>
            <Col sm="12" className="my-4">
              <Row>
                <Col xs="6" sm="6" md="4" lg="3" className="mb-4">
                  <Gain
                    // className="utilityLink"
                    day="Last Month"
                    noTrade={details?.lastMonthNumberOfTrade || 0}
                    amount={details?.lastMonthProfit || 0}
                    percentage={details?.lastMonthTradePercentage || 0}
                  />
                </Col>
                <Col xs="6" sm="6" md="4" lg="3" className="mb-4">
                  <Gain
                    // className="utilityLink"
                    day="This Month"
                    noTrade={details?.currentMonthNumberOfTrade || 0}
                    amount={details?.currentMonthProfit || 0}
                    percentage={details?.currentMonthTradePercentage || 0}
                  />
                </Col>
                <Col xs="6" sm="6" md="4" lg="3" className="mb-4">
                  <Gain
                    // className="utilityLink"
                    day="Yesterday"
                    noTrade={details?.yesterdayNumberOfTrade || 0}
                    amount={details?.yesterdayProfit || 0}
                    percentage={details?.yesterdayTradePercentage || 0}
                  />
                </Col>
                <Col xs="6" sm="6" md="4" lg="3" className="mb-4">
                  <Gain
                    // className="utilityLink"
                    day="Today"
                    noTrade={details?.todayNumberOfTrade || 0}
                    amount={details?.todayProfit || 0}
                    percentage={details?.todayTradePercentage || 0}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="d-flex align-items-start justify-content-between">
            <Col sm="12" md="6" lg="6" className="mb-4">
              <ExchangerGain
                heading="Top Exchanger"
                name={topExchanger?.name}
                // className="utilityLink"
                day="Last Month"
                noTrade={topExchanger?.lastMonthOccurrence || 0}
                /* amount="9000.05" */
                percentage={topExchanger?.lastMonthTradePercentage || 0}
              />
            </Col>
            <Col sm="12" md="6" lg="6" className="mb-4">
              <ExchangerGain
                heading="Top Gainer"
                name={topGainer?.firstname}
                // className="utilityLink"
                day="Last Month"
                noTrade={topGainer?.lastMonthNumberOfTrade || 0}
                amount={topGainer?.lastMonthProfit || 0}
                percentage={topGainer?.lastMonthTradePercentage || 0}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Card id="trade-view" className="striped-tabled-with-hover">
                <Card.Body className="px-0">
                  <TradeView size={10} noScroll activeOnly />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Dashboard
