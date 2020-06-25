import React from 'react';
import {API} from "aws-amplify";
import {
  Badge, Button, Comment, Drawer, Icon, Input, List, message,
  Tag, Tooltip, Form, Descriptions, Rate, Popconfirm
} from 'antd';
import moment from "moment";
import {ApiName} from "../../core/Config";
import { parse } from 'query-string';
import {withAuthContext} from "../../AuthContext";
import UserAvatar from "../../components/UserAvatar";
import FormImage from "../../components/FormImage";
import RoutePaths from "../../core/RoutePaths";
import {Link} from "react-router-dom";
import Payment from "./components/Payment";
import {FormPublishedStates} from "../MyForms";

const { Search, TextArea } = Input;

/**
 * Marketplace page for searching and finding surveys. Can purchase surveys and use them as your own.
 */
export class Marketplace extends React.Component {

  state = {
    currentPage: 1, // The current page of data loaded in the marketplace
    forms: [], // The list of forms currently displaying in the marketplace
    cart: [], // The current users cart of surveys to purchased
    cartVisible: false, // Whether the cart is currently visible
    loading: true, // Whether the marketplace is currently loading more forms
    formVisible: false, // Whether or not a forms details is currently visible
    selectedForm: null, // The selected form to view the details of
    comments: null, // The comments for the current selected form
    search: '', // The value in search bar used to search for surveys
    commentValue: '', // The value of the current comment being typed in the selected survey,
    loadMore: true,
    paymentVisible: false
  };

  /**
   * Loads the next page of data in the marketplace
   */
  onLoadMore = async () => {
    const { currentPage } = this.state;
    this.fetchData(currentPage + 1, false)();
  };

  /**
   * Update the marketplace if the search term in the url changes
   */
  componentDidUpdate = async (prevProps) => {
    const { currentPage, search: searchState } = this.state;
    const { location } = this.props;
    const parsed = parse(location.search);
    const { search } = parsed;
    if (search && search !== prevProps.location.search) {
      if (search !== searchState) {
        this.setState({
          search
        });
        await this.fetchData(currentPage, true, parsed.search)();
      }
    }
  };

  /**
   * Fetch the first page of data for the marketplace on mount
   */
  componentDidMount = async () => {
    const { currentPage } = this.state;
    const { location } = this.props;
    const parsed = parse(location.search);
    if (parsed.search) {
      this.setState({
        search: parsed.search
      })
    }
    this.fetchData(currentPage, true, parsed.search)();
  };

  /**
   * Fetches more data for the marketplace
   * @param currentPage - The page number of data to fetch
   * @param fresh - True if the current survey list should be wiped before fetching more data
   * @param initialSearch
   */
  fetchData = (currentPage, fresh, initialSearch = null) => async () => {
    try {
      let search = initialSearch || this.state.search;
      const forms = fresh ? [] : this.state.forms;
      if (fresh) {
        this.setState({
          loading: true
        });
      }
      const newForms = await API.get(ApiName, `/search?page=${currentPage}&search=${search}`, {});
      this.setState({
        forms: forms.concat(newForms),
        loading: false,
        loadMore: newForms.length === 10
      })
    } catch (err) {
      console.error(err);
      message.error(err.message);
      this.setState({
        loading: false,
        currentPage
      });
    }
  };

  /**
   * Adds a specified form to the current cart
   * @param form - the form to add to the cart
   * @param e - ClickEvent
   */
  addToCart = (form) => (e) => {
    e.stopPropagation();
    const { cart } = this.state;
    if (cart.some(cartForm => cartForm.surveyId === form.surveyId)) {
      message.warning('Item is already in the cart');
      return;
    }
    cart.push(form);
    message.success('Added to cart');
    this.setState({
      cart
    })
  };

  /**
   * Purchase the surveys currently in the cart
   */
  checkout = async (tokenId) => {
    let { cart } = this.state;
    await API.post(ApiName, `/survey/purchase`, {
      body: {
        cart: cart.map(survey => survey.surveyId),
        tokenId
      }
    });
    this.setState({
      cart: [],
      cartVisible: false,
      paymentVisible: false
    })
  };

  /**
   * Renders the current marketplace cart
   * @returns The Cart
   */
  renderCart = () => {
    const { cart, paymentVisible } = this.state;
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <h2>
            Form Name
          </h2>
          <h2>
            Price
          </h2>
        </div>
        {cart.map(cartForm =>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
            <span>
              {unescape(cartForm.name)}
            </span>
            <span>
              ${cartForm.price}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7, marginTop: 15 }}>
            <h3>
              Total
            </h3>
            <h3>
              ${cart.reduce((total, cartForm) => total + cartForm.price, 0)}
            </h3>
        </div>
        {
          paymentVisible
            ? <Payment
              cart={cart}
              checkout={this.checkout}
            />
            : <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
              <Button
                onClick={() => {
                  this.setState({
                    paymentVisible: true
                  })
                }}
                type="primary"
              >
                Checkout
              </Button>
            </div>
        }
      </div>
    )
  };

  /**
   * Adds the current comment value to the list of comments for the selected survey
   */
  handleSubmitComment = async () => {
    const { commentValue, selectedForm } = this.state;
    await API.post("prod-publicus-app-api", `/survey/${selectedForm.surveyId}/comment`, {
      body: {
        comment: commentValue
      }
    });
    this.selectForm(selectedForm)();
    this.setState({
      commentValue: ''
    })
  };

  /**
   * Select a form to view the details of
   * @param form - the form to view
   */
  selectForm = (form) => async (e) => {
    const comments = await API.get(ApiName, `/survey/${form.surveyId}/comment`, {});
    this.setState({
      formVisible: true,
      selectedForm: form,
      comments
    })
  };

  /**
   * Update the current comment value for the selected survey
   * @param e - ChangeEvent
   */
  updateComment = (e) => {
    this.setState({
      commentValue: e.target.value,
    });
  };

  removeFromMarketplace = (form) => async (e) => {
    e.stopPropagation();
    try {
      await API.post(ApiName, "/modifySurveyStatus", {
        body: {
          status: FormPublishedStates.REJECTED,
          surveyId: form.surveyId
        }
      });
      message.success('Removed form from marketplace');
      const { forms } = this.state;
      this.setState({
        forms: forms.filter(savedForm => form.surveyId !== savedForm.surveyId)
      })
    } catch (err) {
      message.error('Failed to remove form from marketplace');
    }
  };

  render() {
    const { forms, cartVisible, cart, formVisible, selectedForm, search, comments, commentValue, loading, loadMore } = this.state;
    const { adminUser } = this.props;

    return (
      <div style={{ height: '100%' , marginLeft: 100, marginRight: 100,}}>
        <div style={{ display: 'flex', flexDirection: 'row', height: '40px' }}>
          <Search
            placeholder="Enter a term to search on..."
            enterButton="Search"
            size="large"
            onChange={value => {
              this.setState({
                search: value.target.value
              })
            }}
            onSearch={this.fetchData(1, true)}
            value={search}
          />
          <Tooltip title="View Cart" >
            <Badge count={cart.length}>
              <div style={{ marginTop: 2, marginLeft: 10, marginRight: 5, fontSize: 35, color: '#3c97ff' }}>
                <Icon
                  type="shopping-cart"
                  onClick={() => this.setState({ cartVisible: true })}
                />
              </div>
            </Badge>
          </Tooltip>
          <Tooltip title="Clear Cart" >
            <Icon
              type="rest"
              style={{ marginTop: 5, marginLeft: 10, marginRight: 5, fontSize: 32, color: 'grey' }}
              onClick={() => this.setState({ cart: [] })}
            />
          </Tooltip>
        </div>
        <div style={{ height: 'calc(100% - 60px)', overflowY: 'scroll', marginTop: 12, border: '2px solid #858f9c', paddingLeft: 12, paddingRight: 10 }}>
          {loading
            ? <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', paddingTop: 200 }}>
                  {/*<strong style={{ fontSize: 25 }}>Loading</strong>*/}
                  <br />
                  <Icon type="loading" style={{ fontSize: 70, marginTop: 8 }} />
              </div>
            : <List
              itemLayout="vertical"
              size="large"
              loadMore={loadMore
                ? <div
                  style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px', marginBottom: 20 }}
                >
                  <Button
                    onClick={this.onLoadMore}
                    type="primary"
                    size="large"
                  >
                    <span style={{ fontSize: 20 }}>Load More...</span>
                  </Button>
                </div>
                : <div
                  style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px', marginBottom: 20 }}
                >
                  <span style={{ fontSize: 20 }}>No More Results</span>
                </div>
              }
              dataSource={forms}
              renderItem={form => (
                <List.Item
                  onClick={this.selectForm(form)}
                  key={form.name}
                  actions={[
                    <span>
                    <Icon type="star-o" style={{ marginRight: 8, color: 'orange' }} />
                      {form.avgRating || "N/A"}
                  </span>,
                    <span>
                    <Icon type="message" style={{ marginRight: 8, color: '#6095ff' }} />
                      {form.numComments}
                  </span>,
                    <div onClick={this.addToCart(form)}><Icon type="plus" style={{ color: '#262cff', marginRight: 6 }}/>
                      Add to Cart
                    </div>,
                    ...[
                      adminUser &&
                        <Popconfirm
                          title="Are you sure you want to remove this form?"
                          onConfirm={this.removeFromMarketplace(form)}
                          onCancel={e => {e.stopPropagation()}}
                          okText="Yes"
                          cancelText="No"
                          placement="topRight"
                        >
                          <div onClick={e => {e.stopPropagation()}}>
                            <Icon type="minus" style={{ color: '#ff1c1a', marginRight: 6 }}/>
                            Remove From Marketplace
                          </div>
                      </Popconfirm>
                    ]
                  ]}
                  extra={
                    <FormImage
                      image={form.image}
                    />
                  }
                >
                  <List.Item.Meta
                    avatar={<UserAvatar image={form.avatar} />}
                    title={<a href={form.href}>{unescape(form.name)}</a>}
                    description={`${form.firstname} ${form.lastname}`}
                  />
                    {form.tags && !!form.tags.length && <React.Fragment>
                      {form.tags.map(tag =><Tag color={'#2db7f5'}>{unescape(tag.tag)}</Tag> )}
                      <br />
                      <br />
                    </React.Fragment>}
                    Price: ${form.price}
                    <br />
                    <br />
                    {unescape(form.description)}
                </List.Item>
              )}
            />
          }
        </div>
        <Drawer
          title="Your Cart"
          width={500}
          onClose={() => this.setState({ cartVisible: false, paymentVisible: false })}
          visible={cartVisible}
        >
          {cart.length
            ? this.renderCart()
            : "Add a form to your cart in order to be able to purchase it"
          }
        </Drawer>
        <Drawer
          title={selectedForm && unescape(selectedForm.name)}
          width={800}
          onClose={() => this.setState({ formVisible: false, paymentVisible: false })}
          visible={formVisible && selectedForm}
        >
          {
            selectedForm
              ? <div>
                <h2>Survey Details</h2>
                <Descriptions title={null} bordered layout="vertical">
                  <Descriptions.Item label={"Description"}>{unescape(selectedForm.description)}</Descriptions.Item>
                  <Descriptions.Item label={"Price"}>${selectedForm.price}</Descriptions.Item>
                  <Descriptions.Item label={"Tags"}>{selectedForm.tags.map(tag =><Tag color={'#2db7f5'}>{unescape(tag.tag)}</Tag> )}</Descriptions.Item>
                </Descriptions>
                <br />
                <Link
                  to={`${RoutePaths.Marketplace}?search=${selectedForm.userId}`}
                >
                  View Other Surveys By This User
                </Link>
                <br />
                <br />
                <h2>Average Rating</h2>
                {selectedForm.avgRating
                  ? <Rate disabled allowHalf value={selectedForm.avgRating}/>
                  : 'There are currently no ratings for this form'
                }
                <br />
                <br />
                <h2>Comments</h2>
                  <div style={{ height: '300px', overflowY: 'scroll'}}>
                    <List
                      className="comment-list"
                      itemLayout="horizontal"
                      dataSource={comments || []} // TODO - ensure in order by using .sort()
                      renderItem={comment => (
                        <li>
                          <Comment
                            avatar={<UserAvatar image={selectedForm.avatar} />}
                            content={comment.comment}
                            datetime={
                              <Tooltip
                                title={moment(comment.submissionTime).format('YYYY-MM-DD HH:mm:ss')}
                              >
                              <span>
                                {moment(comment.submissionTime).fromNow()}
                              </span>
                            </Tooltip>}
                          />
                        </li>
                      )}
                    />
                  </div>
                  <Comment
                    avatar={<UserAvatar />}
                    content={
                      <div>
                        <Form.Item>
                          <TextArea
                            rows={4}
                            onChange={this.updateComment}
                            value={commentValue} />
                        </Form.Item>
                        <Form.Item>
                          <Button htmlType="submit" loading={false} onClick={this.handleSubmitComment} type="primary">
                            Add Comment
                          </Button>
                        </Form.Item>
                      </div>
                    }
                  />
                </div>
              : null
          }
        </Drawer>
      </div>
    );
  }
}


export default withAuthContext(Marketplace);