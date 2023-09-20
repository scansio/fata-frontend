/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react'
import fetcher from '../SharedFetcher'
import { getDataUrlFromUrl, getSupportedToken } from '../misc'
import {
  ALL_NETWORK,
  PRIVATE_FILE
} from '../config/RestEndpoints'
import { Button } from 'react-bootstrap'

export function useTokenAndNetwork (optionsOnly = true, type = 'deposit') {
  const [supportedTokens, setSupportedTokens] = useState([])
  const [tokens, setTokens] = useState([])
  const [tokenOptions, setTokenOptions] = useState([])
  const [networks, setNetworks] = useState([])
  const [networkOptions, setNetworkOptions] = useState([])

  async function onNetworkSelection (networkId) {
    setTokens(
      supportedTokens?.filter((token) => token?.network === networkId) || []
    )
  }

  useEffect(() => {
    fetcher.fetch(ALL_NETWORK).then((data) => {
      setNetworks(data?.data?.networks?.results || [])
    })

    getSupportedToken(type).then((tks) => {
      setSupportedTokens(tks || [])
    })
  }, [])

  useEffect(() => {
    setTokenOptions(
      tokens?.map((token) => (
        <option key={token?._id} value={token?._id} title={token?.name}>
          {token?.symbol}
        </option>
      )) || []
    )
  }, [tokens])

  useEffect(() => {
    setNetworkOptions(
      networks?.map((network) => (
        <option key={network?._id} value={network?._id}>
          {network?.name}
        </option>
      )) || []
    )
  }, [networks])

  if (!optionsOnly) {
    return [
      tokens,
      setTokens,
      tokenOptions,
      setTokenOptions,
      networks,
      setNetworks,
      networkOptions,
      setNetworkOptions,
      onNetworkSelection
    ]
  } else {
    return [tokenOptions, networkOptions, onNetworkSelection]
  }
}

export function useHistoryButton (showing = false, style = {}, className = '') {
  const [history, setHistory] = useState(showing)

  return [
    history,
    setHistory,
    <small
      key="historyButton"
      style={{ float: style.float ? style.float : 'right' }}
    >
      <Button
        className={className}
        style={style}
        onClick={() => setHistory(!history)}
      >
        <i className={`fas fa-${!history ? 'history' : 'arrow-left'}`}></i>
      </Button>
    </small>
  ]
}

export function useGetDataUri (initFilename = '') {
  const [filename, setFilename] = useState(initFilename)
  const [dataUri, setDataUri] = useState('')

  useEffect(() => {
    async function getData () {
      const auri = await getDataUrlFromUrl(PRIVATE_FILE + filename)
      setDataUri(auri)
    }
    if (filename && filename !== '') {
      getData()
    }
  }, [filename])

  return [dataUri || '../assets/img/avatars/1.png', setFilename]
}

/* export function useTokenAndNetwork(optionsOnly = true, type = "deposit") {
  let [tokens, setTokens] = useState([]);
  let [tokenOptions, setTokenOptions] = useState([]);
  let [networks, setNetworks] = useState([]);
  let [networkOptions, setNetworkOptions] = useState([]);

  async function onTokenSelection(token) {
    let data = await fetcher.fetch(TOKEN_NETWORK + token.id);
    if (data) {
      if (data.connection.statusCode !== 200) {
        toast.error(data.data.message);
      } else setNetworks([data.data.network]);
    } else {
      toast.error(`Error fetching network for ${token.name}.`);
    }
  }

  useEffect(() => {
    const fn = async () => {
      let supportedToken = await getSupportedToken(type)
      if (supportedToken[0]) {
        const { _id, name } = supportedToken[0];
        onTokenSelection({ id: _id, name });
      }
      setTokens(supportedToken);
    };
    fn();
  }, []);

  useEffect(() => {
    if (tokens.length > 0) {
      let options = [];
      for (const { _id, name, symbol } of tokens) {
        options.push(
          <option key={_id} value={_id} title={name}>
            {symbol}
          </option>
        );
      }
      setTokenOptions(options);
    }
  }, [tokens]);

  useEffect(() => {
    if (networks.length > 0) {
      let options = [];
      for (const { _id, name } of networks) {
        options.push(
          <option key={_id} value={_id}>
            {name}
          </option>
        );
      }
      setNetworkOptions(options);
    }
  }, [networks]);

  if (!optionsOnly) {
    return [
      tokens,
      setTokens,
      tokenOptions,
      setTokenOptions,
      networks,
      setNetworks,
      networkOptions,
      setNetworkOptions,
      onTokenSelection,
    ];
  } else {
    return [tokenOptions, networkOptions, onTokenSelection];
  }
} */
