{/*
  {isUserWalletConnected ? (
            <>
              <Typography variant="h6">
                <strong>Swap</strong>
              </Typography>

              <Paper
                variant="outlined"
                sx={{ p: 2 }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Typography
                    variant="body1"
                    color="GrayText"
                  >
                    You Pay
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <TextField
                    inputRef={amountAInputRef}
                    type="number"
                    value={amountA}
                    disabled={isFetchingQuotes}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setAmountA(0);
                        return;
                      }
                      const parsed = parseFloat(value);
                      if (isNaN(parsed)) setAmountA(0);

                      if (parsed < 0) {
                        setAmountA(0);
                      }

                      setAmountA(parsed);
                    }}
                    sx={{
                      '& fieldset': { border: 'none' },
                    }}
                  />

                  <SelectToken
                    token={tokenA}
                    setToken={setTokenA}
                    inputLabel="Select a token"
                  />
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{ p: 2 }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Typography
                    variant="body1"
                    color="GrayText"
                  >
                    You Receive (Estimate)
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {isFetchingQuotes ? (
                    <Typography
                      color="GrayText"
                      sx={{ minWidth: '41%' }}
                    >
                      Fetching quotes...
                    </Typography>
                  ) : (
                    <>
                      <TextField
                        type="number"
                        value={Boolean(selectedQuote) ? amountB.toFixed(4) : 0}
                        InputProps={{
                          readOnly: true,
                        }}
                        onChange={(e) => {
                          return;
                        }}
                        sx={{
                          '& fieldset': { border: 'none' },
                        }}
                      />
                    </>
                  )}

                  <SelectToken
                    token={tokenB}
                    setToken={setTokenB}
                    inputLabel="Select a token"
                  />
                </Stack>
              </Paper>
            </>
          ) : (
            <Stack
              alignItems="center"
              sx={{ p: 4 }}
            >
              <IoWalletSharp size={256} />
            </Stack>
          )}

          {!isUserWalletConnected ? (
            <Alert severity="error">Please connect your wallet first</Alert>
          ) : (
            <>
              {tokenA && tokenB ? (
                <>
                  {notEnoughTokenABalance ? (
                    <Alert severity="error">You do not have enough {tokenA?.symbol} to swap</Alert>
                  ) : (
                    <>
                      {notEnoughTokenAAllowance ? (
                        <>
                          <Alert severity="warning">
                            You have not approved SerpentSwap to spend and swap your {tokenA?.symbol}
                          </Alert>

                          <LoadingButton
                            variant="contained"
                            size="large"
                            onClick={() => {
                              if (approveTokenA) approveTokenA();
                            }}
                            loading={isApprovingTokenA || isApproveTokenATxPending}
                            fullWidth
                          >
                            Approve {tokenA?.symbol}
                          </LoadingButton>
                        </>
                      ) : (
                        <>
                          {tokenA.address === tokenB.address ? (
                            <Alert severity="error">You cannot swap the same token</Alert>
                          ) : (
                            <>
                              {amountOutDiffTooGreat && !isFetchingQuotes && tokenA.address !== tokenB.address && (
                                <Alert severity="warning">
                                  The amount you receive is {amountOutDifferencePercentage.toFixed(2)}% different from
                                  the expected amount based on the current price. This may be due to lack of liquidity
                                  in the pool. Please proceed with caution.
                                </Alert>
                              )}

                              <LoadingButton
                                disabled={debouncedAmountA === 0 || isFetchingQuotes}
                                variant="contained"
                                size="large"
                                onClick={() => {
                                  if (isTokenANative) {
                                    if (swapNativeForToken) swapNativeForToken();
                                  } else if (isTokenBNative) {
                                    console.log('swapTokenForNative', swapTokenForNative);
                                    if (swapTokenForNative) swapTokenForNative();
                                  } else {
                                    if (swapTokens) swapTokens();
                                  }
                                }}
                                loading={
                                  isSwappingTokens ||
                                  isSwapTokensTxPending ||
                                  isSwappingNativeForToken ||
                                  isSwapNativeForTokenTxPending ||
                                  isSwappingTokenForNative ||
                                  isSwapTokenForNativeTxPending
                                }
                                fullWidth
                              >
                                Swap
                              </LoadingButton>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Alert severity="error">Please select tokens</Alert>
              )}
            </>
          )}
*/}