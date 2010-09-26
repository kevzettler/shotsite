class Order < ActiveRecord::Base
  belongs_to :user

  has_many :transactions, :class_name => "OrderTransaction"
  
  attr_reader :express_token
  attr_accessor :card_number, :card_verification

  validate_on_create :validate_card
  
  def purchase
    return false unless credit_card.valid?

    response = process_purchase
    transactions.create!(:action => "purchase", :amount => price_in_cents, :response => response)
    if response.success?
      price_per_shot = 5
      user = self.user
      user.shots += (price_in_cents.to_f / price_per_shot).ceil
      user.save
      self.status = "success"
    else
      self.status = "failed"
      #self.message
    end

    self.save
    response.success?
  end

  def price_in_cents
    self.price * 100
  end

  def express_token=(token)
    if token.blank? and !self[:express_token].blank? 
      self[:express_token]
    elsif !token.blank? and self[:express_token].blank?
      self[:express_token] = token
      if new_record? && !token.blank?
        details = EXPRESS_GATEWAY.details_for(token)
        self.express_payer_id = details.payer_id
        self.first_name = details.params["first_name"]
        self.last_name = details.params["last_name"]
      end
    end
  end

  private
  
  def process_purchase
    if express_token.blank?
      STANDARD_GATEWAY.purchase(price_in_cents, credit_card, standard_purchase_options)
    else
      EXPRESS_GATEWAY.purchase(price_in_cents, credit_card, :ip => express_purchase_options)
    end
  end
  
  def standard_purchase_options
    {
      :ip => ip_address,
      :email => user.email
      #:billing_address => {
        #:name => "#{self.first_name} #{self.last_name}",
        #:address1 => self.address1,
        #:city => self.city,
        #:state => self.state,
        #:country => self.country,
        #:zip => self.zip
      #}
    }
  end
  
  def express_purchase_options
    {
      :ip => ip_address,
      :token => express_token,
      :payer_id => express_payer_id
    }
  end
  
  def validate_card
    if express_token.blank? and !credit_card.valid?
      credit_card.errors.full_messages.each do |message|
        errors.add_to_base message
      end
    end
  end
  
  def credit_card
    @credit_card = ActiveMerchant::Billing::CreditCard.new(
                                                             :type => card_type,
                                                             :number => card_number,
                                                             :verification_value => card_verification,
                                                             :month => card_expires_on.month,
                                                             :year => card_expires_on.year,
                                                             :first_name => first_name,
                                                             :last_name => last_name
                                                             )
  end
  
end
